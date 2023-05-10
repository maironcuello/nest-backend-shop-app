import { v4 as uuidv4 } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtensiom = file.mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtensiom}`;
  callback(null, fileName);
};
