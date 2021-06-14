import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
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

export const editFileName = (req: any, file: any, cb: any) => {
  console.log('diskStorage', file);
  cb(null, `${uuid()}${extname(file.originalname)}`);
};
