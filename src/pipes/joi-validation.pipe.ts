import { Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe {
    constructor(private schema) {}

    transform( value, metadata: ArgumentMetadata) {
       const {error} = this.schema.validate( value);

        if (error) {
            throw new BadRequestException(error.message);
        }
        return value;
    }
}
