import * as moment from 'moment';

const A_GIORNI = [
  'PAD', 'LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI', 'SABATO', 'DOMENICA',
];

export enum GIORNI {
  PAD = 0, LUNEDI = 1, MARTEDI = 2, MERCOLEDI = 3, GIOVEDI = 4, VENERDI = 5, SABATO = 6, DOMENICA = 7,
}

export class Utils {

  static readonly TIME_FORMAT: string = 'HH:mm:ss';
  static readonly SERVER_DATETIME_FMT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

  public static daysForMonthYear(month: number | string, year: number | string, locale: string = 'it') {
    const now = moment().utc();

    let _m = month || now.month(), _y = year || now.year();

    _m = _m.toString().padStart(2, '0');
    _y = _y.toString().padStart(2, now.year().toString());


    // a questo punto avremo un formato data del tipo yyyy-mm
    return moment().locale(locale).utc().set({month: Number(_m), year: Number(_y)}).daysInMonth();
  }

  public static formatDateTimeForServer(date: moment.MomentInput, inputFormat?: string): string {
    if (typeof date === 'string') {
      return moment(date, inputFormat).format(Utils.SERVER_DATETIME_FMT);
    } else if (date instanceof Date) {
      return moment(date).format(Utils.SERVER_DATETIME_FMT);
    } else if (typeof date === 'number') {
      return moment(new Date(date)).format(Utils.SERVER_DATETIME_FMT);
    } else {
      return moment(date).format(Utils.SERVER_DATETIME_FMT);
    }
  }

  public static normalizeDateObject(date: {day: string | number, month: string | number, year: string | number}): {day: string | undefined, month: string | undefined, year: string | undefined} {
    return {
      day: date.day !== undefined || date.day !== null ? date.day.toString().padStart(2, '0') : undefined,
      month: date.month !== undefined || date.month !== null ? date.month.toString().padStart(2, '0') : undefined,
      year: date.year !== undefined || date.year !== null ? date.year.toString().padStart(4, moment().year().toString()) : undefined,
    };
  }

  public static trim(str: string): string {
    if (typeof str === 'string') {
      return str.trim();
    }
    return str;
  }

  /**
   * Check if the store is opened at current time
   * @param store The store with opening time and/or closing time
   * @return The method will return <i>true</i> if the current time is between start and end of day or evening, <i>false</i> if not.
   * When the timing is not found for current day the method will return <i>undefined</i>
   */
  public static checkOpenedStore(store: any): boolean | undefined {
    // TODO Check why shop.orario list is not right

    const now = moment().utc();

    const weekday = now.weekday();

    const _store = (store || {});
    const orari: any = _store.orari || _store.negozioOrari || _store.orariNegozio || [];

    // Mi servirà per mappare tutti gli orari
    // Il PAD è utile per poter usare l'indice di settimana usato da moment (da 1 a 7)
    const mapped: any = {
      [GIORNI.PAD]: {},
      [GIORNI.LUNEDI]: {},
      [GIORNI.MARTEDI]: {},
      [GIORNI.MERCOLEDI]: {},
      [GIORNI.GIOVEDI]: {},
      [GIORNI.VENERDI]: {},
      [GIORNI.SABATO]: {},
      [GIORNI.DOMENICA]: {},
    };

    // Se non ci sono orari vuol dire che non devo controllare nulla
    if (orari.length === 0) {
      return undefined;
    }

    for (let i = 0, len = orari.length; i < len; i++) {
      const orario = orari[i];
      const giorno = orario.giorno;

      let am: moment.Moment, cm: moment.Moment, ap: moment.Moment, cp: moment.Moment;

      // Per ogni orario di mattina e pomeriggio mappo la stringa (che con isValid() === true solo se l'orario combacia con il formato.
      // Per valori null, undefined, stringa vuota o con formato erraro l'oggetto moment avrà isValid() === false ma non darà errore per
      //    le istruzioni successive
      // Dopo aver parsato l'orario imposto la data ripettiva con la data attuale per avere una maggiore affidabilità dei calcoli.
      // Tutte le date (anche quella attuale) sono trattate come UTC
      am = moment(orario.oraAperturaMattina, Utils.TIME_FORMAT).utc().year(now.year()).month(now.month()).day(now.day());
      cm = moment(orario.oraChiusuraMattina, Utils.TIME_FORMAT).utc().year(now.year()).month(now.month()).day(now.day());
      ap = moment(orario.oraAperturaPomeriggio, Utils.TIME_FORMAT).utc().year(now.year()).month(now.month()).day(now.day());
      cp = moment(orario.oraChiusuraPomeriggio, Utils.TIME_FORMAT).utc().year(now.year()).month(now.month()).day(now.day());

      // mattina e pomeriggio sono dei booleani per un veloce controllo della disponibilità di orari in mattinata o nel pomeriggio
      mapped[A_GIORNI.indexOf(giorno.toUpperCase())] = {
        am,
        cm,
        ap,
        cp,
        mattina: (am.isValid() && cm.isValid()),
        pomeriggio: (ap.isValid() && cp.isValid())
      };

    }

    // Recupero l'orario da controllare in base all'indice del giorno nella settimana
    const currentOrario = mapped[weekday] || {};

    // Se non c'è alcun oggetto orario nella mappa o non ci sono orari ne per la mattina ne per il pomeriggio allora ritorno subito undefined
    if (!currentOrario || (!currentOrario.mattina && !currentOrario.pomeriggio)) {
      return undefined;
    }

    // Altrimenti controllo l'orario con la data attuale
    return Utils.checkOpenedStoreTime(currentOrario);
  }

  private static checkOpenedStoreTime(map: any): boolean | undefined {
    const now = moment().utc();

    const sM = map.am, eM = map.cm,
      sP = map.ap, eP = map.cp,
      m = map.mattina, p = map.pomeriggio;

    return ((m && now.isBetween(sM, eM, 'minute')) || (p && now.isBetween(sP, eP, 'minute')));
  }

}