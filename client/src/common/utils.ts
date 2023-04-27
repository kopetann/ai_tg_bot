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

  static getFullDate(dateTime: number | string): string {
    const date = new Date(
      typeof dateTime === 'string' ? parseInt(dateTime) : dateTime,
    );
    return `${date.getUTCDate()} ${date.toLocaleDateString('ru', {
      month: 'long',
    })} ${date.getFullYear()} ${date.getUTCHours()}:${date.getMinutes()}`;
  }

  static getTimezoneDate(offset = 3, inMilliseconds = false): number | Date {
    const date = new Date();
    const gmtDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    return inMilliseconds ? gmtDate.getTime() : gmtDate;
  }

  static dateWithOffsetDays(days: number): Date {
    let date: number | Date = this.getTimezoneDate();
    if (typeof date === 'number') date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
  }
}
