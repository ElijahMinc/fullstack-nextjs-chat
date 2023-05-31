export class FileService {
  static listValidTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    //  'image/gif',
    //  'application/pdf',
  ];
  static validSize = 2 * 1024 * 1024; // 2mb
  static Base64PrefixPDF = 'data:application/pdf;base64,'; // default value

  static async dataURLtoBlob(dataURL: string) {
    return await fetch(dataURL)
      .then((data) => data.blob())
      .then((blob) => blob);
  }

  static readBlob(blob: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', reject);
      reader.readAsDataURL(blob);
    });
  }

  static isInvalidFormat(file: File) {
    return !FileService.listValidTypes.includes(file.type);
  }

  static isInvalidSize(file: File) {
    return file.size > FileService.validSize;
  }

  static isPDF(file: File) {
    const pdfFormat =
      FileService.listValidTypes[FileService.listValidTypes.length - 1]; //last elem
    return pdfFormat.includes(file.type);
  }

  static getBase64PrefixOfFile(format: string, type: string) {
    const mask = `data:${format}/${type};base64,`;
    return mask;
  }
}
