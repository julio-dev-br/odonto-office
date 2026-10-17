import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.serialize(data)),
    );
  }

  private serialize(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    // Se for um BigInt puro, transforma em string
    if (typeof obj === 'bigint') {
      return obj.toString();
    }

    // Se for um array, varre cada item recursivamente
    if (Array.isArray(obj)) {
      return obj.map((item) => this.serialize(item));
    }

    // Se for um objeto, varre cada propriedade
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = this.serialize(obj[key]);
        }
      }
    }

    return obj;
  }
}
