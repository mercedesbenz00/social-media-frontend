import moment from 'moment-with-locales-es6'

export class DurationToTimeSpan {
  static getTimeSpanTextForDuration(tDuration: moment.Duration): string {
    if (tDuration.asMonths() >= 6) {
      const tMonths = parseInt(tDuration.asMonths() + '', 10)
      return `${tMonths} months ago`
    } else if (tDuration.asWeeks() >= 3) {
      const tWeeks = parseInt(tDuration.asWeeks() + '', 10)
      return `${tWeeks} weeks ago`
    } else if (tDuration.asDays() >= 1) {
      const tDays = parseInt(tDuration.asDays() + '', 10)
      const tContent = ''
      if (tDays === 1) {
        return `${tDays} day ago`
      } else {
        return `${tDays} days ago`
      }
    } else if (tDuration.asHours() >= 1) {
      const _tHours = parseInt(tDuration.asHours() + '', 10)
      const tContent = ''
      if (_tHours === 1) {
        return `${_tHours} hour ago`
      } else {
        return `${_tHours} hours ago`
      }
    } else if (tDuration.asMinutes() > 1) {
      const _tMinutes = parseInt(tDuration.asMinutes() + '', 10)
      const tContent = ''
      if (_tMinutes === 1) {
        return `${tContent} minute ago`
      } else {
        return `${tContent} minutes ago`
      }
    } else {
      return `Just now`
    }
  }

  static getTimeSpanText(postDate: number): string {
    const tPostDate = Math.floor(postDate / 1000)
    const tCreated = moment.unix(tPostDate)
    const tDuration = moment.duration(moment().diff(tCreated))
    return DurationToTimeSpan.getTimeSpanTextForDuration(tDuration)
  }
}
