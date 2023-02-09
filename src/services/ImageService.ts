import CrudService from './CrudService';

class ImageService extends CrudService {
  public uniqueName: string;

  constructor() {
    super('/photos');
    this.uniqueName = 'image';
  }

  public async getAllImages(params: any): Promise<
    {
      id: string;
      description: string;
      urls: { full: string; small: string };
      width: number;
      height: number;
    }[]
  > {
    return await this.getAll(params);
  }
}

export default new ImageService();
