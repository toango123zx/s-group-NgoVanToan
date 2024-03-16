import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/service/prisma.service';
import { RegisterBodyRequestDto } from '../dto/request/body/register.body.request.dto';
import { User } from 'src/modules/users/models/user.model';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

    async validateUser(username: string): Promise<User>{
        try {
            return await this.prismaService.users.findUnique({
                select: {
                    id: true,
                    username: true,
                    password: true,
                    fullName: true,
                    roles: {
                        select: {
                            id: true,
                            name: true,
                            isEditable: true,
                            permissions: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                },
                where: {
                    username: username,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async registerUser(user: RegisterBodyRequestDto, role: string = 'user'): Promise<boolean> {
        try {
            await this.prismaService.users.create({
                select: {
                    id: true,
                    username: true,
                    password: true,
                    fullName: true,
                    roles: {
                        select: {
                            id: true,
                            name: true,
                            isEditable: true,
                            permissions: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                },
                data: {
                    username: user.username,
                    password: user.password,
                    fullName: user.fullName,
                    roles: {
                        connect: {
                            name: role,
                        },
                    }
                
                },
            });
            return true;
        } catch (error) {
            throw new Error('Prisma error in registerUser service');
        }
    }

}