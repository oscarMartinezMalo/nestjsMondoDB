import { Test, TestingModule } from '@nestjs/testing';
import { PaypalPaymentService } from './paypal-payment.service';

describe('PaypalPaymentService', () => {
  let service: PaypalPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaypalPaymentService],
    }).compile();

    service = module.get<PaypalPaymentService>(PaypalPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
