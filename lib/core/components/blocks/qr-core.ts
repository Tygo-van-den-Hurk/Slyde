import qrCode, { type QRCodeToStringOptions } from 'qrcode';
import { Component } from '#lib/core/components/class';

type correctionLevelChoicesShort = (typeof QrCode.correctionLevelChoicesShort)[number];
type correctionLevelChoicesLong = (typeof QrCode.correctionLevelChoicesLong)[number];
type correctionLevelChoices = correctionLevelChoicesShort | correctionLevelChoicesLong;
type correctionLevelMap = Record<correctionLevelChoices, correctionLevelChoicesLong>;

/** The `QR-Code` component. Shows a QR code image to somewhere. */
@Component.register.using({ plugin: false })
export class QrCode extends Component {
  /** The correction levels to chose from in their short form. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly correctionLevelChoicesShort = ['l', 'm', 'q', 'h'] as const;

  /** The correction levels to chose from in their long form. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly correctionLevelChoicesLong = [
    'low',
    'medium',
    'quartile',
    'high',
  ] as const;

  /** The correction levels to chose from. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly correctionLevelChoices = [
    ...QrCode.correctionLevelChoicesShort,
    ...QrCode.correctionLevelChoicesLong,
  ] as const;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly correctionLevelMap: correctionLevelMap = {
    h: 'high', // eslint-disable-line id-length
    high: 'high',
    l: 'low', // eslint-disable-line id-length
    low: 'low',
    m: 'medium', // eslint-disable-line id-length
    medium: 'medium',
    q: 'quartile', // eslint-disable-line id-length
    quartile: 'quartile',
  } as const;

  /** The correction level to use. Can range from **L**ow, to **H**igh. */
  readonly #correctionLevel = Component.utils.extract({
    aliases: ['correction-level', 'correction'],
    context: this,
    fallback: 'medium',
    transform(value, context, key) {
      const choices = QrCode.correctionLevelChoices;
      const validated = Component.utils.transform.enum(choices)(value, context, key);
      return QrCode.correctionLevelMap[validated];
    },
  });

  /** The version of the QR-Code specification to use. */
  readonly #version = Component.utils.extract({
    aliases: ['qr-code-version', 'spec-version', 'version'],
    context: this,
    transform(value) {
      if (typeof value !== 'string') return value;
      return Number.parseInt(value, 10);
    },
  });

  /** The data of the qr-code / where the QR code goes to. */
  readonly #data = Component.utils.extract({
    aliases: ['data', 'url', 'to'],
    context: this,
    missing: 'error',
  });

  /** The description of the image. Will be used for screen readers and such. */
  readonly #description = Component.utils.extract({
    aliases: ['description', 'alt'],
    context: this,
    missing: 'warn',
  });

  /** The color of the dark part of the QR code. */
  readonly #colorDark = Component.utils.extract({
    aliases: ['color-dark', 'color-1'],
    context: this,
    fallback: '#000000ff',
  });

  /** The color of the light part of the QR code. */
  readonly #colorLight = Component.utils.extract({
    aliases: ['color-light', 'color-2'],
    context: this,
    fallback: '#ffffffff',
  });

  @Component.utils.children.reject
  // eslint-disable-next-line jsdoc/require-jsdoc
  public async render(): Promise<string> {
    const options: QRCodeToStringOptions = {};
    options.type = 'svg';
    options.errorCorrectionLevel = this.#correctionLevel;
    options.version = this.#version;
    options.color = {};
    options.color.dark = this.#colorDark;
    options.color.light = this.#colorLight;
    const svg = await qrCode.toString(this.#data, options);
    const source = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    const description = this.#description ?? 'a QR-Code';
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<img class="h-full w-full object-fill" src="${source}" alt="${description}">`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.block, '+'];
  }
}
