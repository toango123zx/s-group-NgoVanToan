import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/service/prisma.service';
import { User } from '../models/user.model';
import { UpdateInfomationBodyRequestDto } from '../dto/request/body/update-infomation.body.request.dto';
import { SearchUserParamsRequestDto } from '../dto/request/params/searchUser.params.request.dto';
import { EnumSearchMode } from 'prisma/enums/query.enum';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }
    async getUserByUsername(username: string) {
        try {

        } catch (error) {
            throw error;
        }
    }

    async updateUserById(id: string, data: UpdateInfomationBodyRequestDto): Promise<User> {
        try {
            return await this.prismaService.users.update({
                where: {
                    id: id
                },
                data: data
            })
        } catch (error) {
            throw error;
        }
    }

    async getUsers(page: number = 0, limit: number = 10): Promise<User[]> {
        try {
            return await this.prismaService.users.findMany({
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    email: true,
                    age: true,
                    roles: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: {
                    roles: {
                        some: {
                            NOT: {
                                name: "superAdmin"
                            }
                        }
                    }
                },
                skip: Number((page - 1) * limit),
                take: Number(limit),
            });
        } catch (error) {
            throw error;
        };
    };

    async getUserById(id: string): Promise<User> {
        try {
            return await this.prismaService.users.findUnique({
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    email: true,
                    age: true,
                    roles: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        }
    };

    async getUsersByNameOrEmail(user: SearchUserParamsRequestDto, searchMode: EnumSearchMode = EnumSearchMode.EQUAL): Promise<User[]> {
        if (user.fullName === undefined && user.email === undefined) {
            return [];
        };

        try {
            return await this.prismaService.users.findMany({
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    email: true,
                    age: true,
                    roles: {
                        select: {
                            name: true
                        }
                    }
                },
                where: {
                    fullName: {
                        [searchMode]: user.fullName
                    },
                    email: {
                        [searchMode]: user.email
                    }
                }
            });
        } catch (error) {
            throw error;
        };
    };
}
