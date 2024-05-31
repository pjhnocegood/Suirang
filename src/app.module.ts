import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuiWeb3Module } from './sui-web3/sui-web3.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 여기에 데이터베이스 타입을 명시
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'sui',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 사용
    }),
    CacheModule.register({
      ttl: 60, // seconds
      isGlobal: true, // 캐시모듈을 전역설정
    }),
    SuiWeb3Module,
    GameModule,
    CommunityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
