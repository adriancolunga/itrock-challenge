import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './modules/tasks/entities/task.entity';
import { IEnvs } from './common/interfaces';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ExceptionsFilter } from './common/exceptions/all.exception';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';
import { RefreshStrategy, AuthStrategy } from './common/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvs>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    WinstonModule.forRoot(winstonConfig),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 0,
        limit: 0,
      },
    ]),
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
      ttl: 600,
    }),
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    AuthStrategy,
    RefreshStrategy,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
