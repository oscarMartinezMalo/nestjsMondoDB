import { Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe {
    constructor(private schema) { }

    transform(value: any, metadata: ArgumentMetadata) {
        const {user, ...valueValidate} = value;
        const { error } = this.schema.validate(valueValidate);

        if (error) {
            throw new BadRequestException(error.message);
        }
        return value;
    }
}
