import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { RxMediaType } from 'entity-interface/RxMediaType';
import { v4 as uuid } from 'uuid';

export const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype.match(
      /\/(jpg|jpeg|png|gif|pdf|AVI|nAVI|ASF|MOV|3GP|WMV|DivX|XviD|RM|RMV)$/,
    )
  ) {
    // Allow storage of file
    cb(null, true);
  } else {
    // Reject file
    cb(
      new HttpException(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};

export const fileName = (req: any, file: any, cb: any) => {
  cb(null, getFileName(file));
};

export const getFileName = (file: Express.Multer.File) => {
  return `${uuid()}${extname(file.originalname)}`;
};

export const getFileType = (file: any): RxMediaType => {
  const ext = extname(file.originalname).replace('.', '');

  if (
    ext === 'doc' ||
    ext === 'docx' ||
    ext === 'xsl' ||
    ext === 'xslx' ||
    ext === 'pdf'
  ) {
    return RxMediaType.DOCUMENT;
  }

  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') {
    return RxMediaType.IMAGE;
  }
  if (
    ext === 'avi' ||
    ext === 'mov' ||
    ext === 'rmvb' ||
    ext === 'rm' ||
    ext === 'flv' ||
    ext === 'mp4' ||
    ext === '3gp'
  ) {
    return RxMediaType.VIDEO;
  }

  if (
    ext === 'mpeg' ||
    ext === 'mp3' ||
    ext === 'mpeg-4' ||
    ext === 'midi' ||
    ext === 'wma'
  ) {
    return RxMediaType.AUDIO;
  }
};
