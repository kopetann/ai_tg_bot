import ffmpeg from 'fluent-ffmpeg';

export class Utils {
  static convertFile(path, from_type, to_type) {
    return new Promise((resolve, reject) => {
      ffmpeg(path)
        .format(from_type)
        .toFormat(to_type)
        .save(path)
        .on('end', () => {
          resolve(path);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
