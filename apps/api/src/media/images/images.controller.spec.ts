import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

describe('MediaController', () => {
  let imagesController: ImagesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService],
    }).compile();

    imagesController = app.get<ImagesController>(ImagesController);
  });

  describe('root', () => {
    it('should return an error when not provided an image id', () => {
      expect(imagesController.getOne(null)).toBe('Hello World!');
    });
  });
});
