import { type SlydeHtmlDocumentHtmlProperties, htmlDocument } from '#lib/core/browser/index';
import { Component } from '#lib/core/components/class';

const DEFAULT_TITLE = 'Untitled Presentation' as const;
const DEFAULT_DESCRIPTION = 'This is a presentation made with Slyde.' as const;
const DEFAULT_KEYWORDS = 'Slyde presentation' as const;
const DEFAULT_AUTHOR = process.env.USER ?? process.env.USERNAME ?? 'an unknown author';
const DEFAULT_BACKGROUND = '#FfFfFf' as const;
const DEFAULT_FOREGROUND = '#000000' as const;
const DEFAULT_PRIMARY = '#3B82F6' as const;
const DEFAULT_SECONDARY = 'F59E0B' as const;
const DEFAULT_SIZE = '80x45';
const DEFAULT_ICON_URL = `data:image/svg+xml;base64,
PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDov
L3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMC4yMDQ0IDYyNS4wMDQ5IDY1Ny45OTk2
IiB3aWR0aD0iNjI1LjAwNXB4IiBoZWlnaHQ9IjY1OHB4Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJH
cmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQzOTU3IiB4MT0iMjA1LjM4MTg0IiB5MT0iNDQwLjY3
MjczIiB4Mj0iNTYyLjUwOTA5IiB5Mj0iMTEwLjgxODE4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3Bh
Y2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA3NDk3MywgMCwgLTAuNDE5NzQz
LCAxLjA1NzgzOCwgNDcuNjA5MiwgLTEwLjY1NzgwMSkiIGhyZWY9IiNsaW5lYXJHcmFkaWVudDM5
NTYiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQzOTU2Ij4KICAgICAg
PHN0b3Agc3R5bGU9InN0b3AtY29sb3I6I2ZmNzIxODtzdG9wLW9wYWNpdHk6MTsiIG9mZnNldD0i
MCIgaWQ9InN0b3AzOTU2Ii8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiNmOWMyNjI7
c3RvcC1vcGFjaXR5OjE7IiBvZmZzZXQ9IjEiIGlkPSJzdG9wMzk1NyIvPgogICAgPC9saW5lYXJH
cmFkaWVudD4KICA8L2RlZnM+CiAgPGcgaWQ9ImcxIiBzdHlsZT0iZGlzcGxheTogaW5saW5lOyB0
cmFuc2Zvcm0tb3JpZ2luOiAyODguNjk1cHggMzI5LjkyMnB4OyIgdHJhbnNmb3JtPSJtYXRyaXgo
MS4wMDIzODgsIDAsIDAsIDEuMDAyMzg4LCAxNC4zNDc5NDI2NCwgLTAuNzE3ODA0MDIpIj4KICAg
IDxwYXRoIGQ9Ik0gNTYxLjc4MSAxLjcwNiBMIDUyNy41NjMgOS42NTYgTCA0OTMuMzQ2IDE3LjYw
NiBMIDQwMS4wNSAzOS4xMjkgTCAzMDguNzU3IDYwLjY1MSBMIDMxNC4zMDIgNjEuMzM5IEwgMzE5
Ljg1IDYyLjAyNSBMIDM4MC41MjcgNjIuMDM2IEwgNDQxLjIwNiA2Mi4wNDYgTCA0MzkuNzQxIDYz
LjA4MyBMIDQzOC4yNzMgNjQuMTIgTCAzNDcuOTk2IDg1LjgyNyBMIDI1Ny43MTkgMTA3LjUzMyBM
IDI1NS4xNzggMTA4LjUxOCBMIDI1Mi42MzcgMTA5LjUwNCBMIDMyNy44MDEgMTA5LjU3NiBMIDQw
Mi45NjggMTA5LjY0OSBMIDQwMS41NjIgMTEwLjYxNiBMIDQwMC4xNTggMTExLjU4MyBMIDMwMS43
MDggMTMzLjQ4MyBMIDIwMy4yNTggMTU1LjM4MiBMIDIwMS44NjUgMTU2LjMxOCBMIDIwMC40NzQg
MTU3LjI1MiBMIDI4Mi42MDIgMTU3LjI1MiBMIDM2NC43MyAxNTcuMjUyIEwgMzYzLjMzOSAxNTgu
MTgxIEwgMzYxLjk1IDE1OS4xMTEgTCAyNTYuNzQ4IDE4MS4xODkgTCAxNTEuNTQ3IDIwMy4yNjcg
TCAyMzguNTYyIDIwMy41MzggTCAzMjUuNTc2IDIwMy44MDkgTCAzMjQuNjExIDIwNS4xMjUgTCAz
MjMuNjQ2IDIwNi40NDEgTCAzMDguNTc2IDIwOS40MjIgTCAyOTMuNTA1IDIxMi40MDQgTCAyMTIu
NTA0IDIyOC4yNTUgTCAxMzEuNTAzIDI0NC4xMDggTCAxMTMuNDMgMjQ3LjY2NCBMIDk1LjM1OCAy
NTEuMjE3IEwgMTkxLjI2MyAyNTEuMzA4IEwgMjg3LjE2OSAyNTEuMzk5IEwgMjg2Ljc3OCAyNTIu
Mzg1IEwgMjg2LjM4NiAyNTMuMzcyIEwgMjg0LjE5OCAyNTMuOTggTCAyODIuMDExIDI1NC41ODcg
TCAxOTYuMjA4IDI3MC41MTUgTCAxMTAuNDA2IDI4Ni40NDIgTCA3Ny4zMTggMjkyLjYxOCBMIDQ0
LjIzMSAyOTguNzkzIEwgMTQ2LjU4MSAyOTguODk2IEwgMjQ4LjkzMSAyOTkuMDAyIEwgMjQ4LjUx
OSAzMDAuMDM5IEwgMjQ4LjEwOCAzMDEuMDc2IEwgMjQ1LjQ2OCAzMDEuNjM0IEwgMjQyLjgyOCAz
MDIuMTkgTCAxOTcuMTk2IDMxMC4xODEgTCAxNTEuNTY0IDMxOC4xNzEgTCA5OC40MDIgMzI3LjUz
IEwgNDUuMjM5IDMzNi44OTIgTCAxNS44MDYgMzQyLjAxMiBMIC0xMy42MjYgMzQ3LjEzMyBMIDE0
Ny41NDUgMzQ3LjY2MiBMIDMwOC43MTUgMzQ4LjE5MSBMIDI5MS4xMzUgMzY4LjgxOSBMIDI3My41
NTIgMzg5LjQ0NyBMIDI0OS4yNSA0MTguMDA5IEwgMjI0Ljk0NiA0NDYuNTcgTCAxOTQuMzI1IDQ4
Mi41MzcgTCAxNjMuNzA1IDUxOC41MDMgTCAxMDUuNDk5IDU4Ni43MzQgTCA0Ny4yOTEgNjU0Ljk2
NCBMIDQ2LjA3NiA2NTYuNTUxIEwgNDQuODYzIDY1OC4xMzggTCA0OS4zNDUgNjU0Ljk2NCBMIDUz
LjgyOSA2NTEuNzkxIEwgMTY4LjU5NiA1NjMuOTg4IEwgMjgzLjM2MSA0NzYuMTg4IEwgMzE4Ljc1
NSA0NDkuMjEzIEwgMzU0LjE0NyA0MjIuMjM4IEwgMzYxLjkxNiA0MTYuMzg1IEwgMzY5LjY4NiA0
MTAuNTI5IEwgMzc1LjkxNCA0MDUuODA2IEwgMzgyLjE0NiA0MDEuMDgxIEwgNDUyLjIxMiAzNDcu
NjIzIEwgNTIyLjI4MSAyOTQuMTY1IEwgNTYwLjg4MiAyNjQuNjEgTCA1OTkuNDg0IDIzNS4wNTQg
TCA2MDQuNjg2IDIzMS4wNjEgTCA2MDkuODkgMjI3LjA2NyBMIDUwMC4xODIgMjI3LjA2NyBMIDM5
MC40NzIgMjI3LjA2NyBMIDM5MC4zNSAyMjYuMjczIEwgMzkwLjIyOCAyMjUuNDggTCA0MTkuMjYx
IDE4Ny45MjcgTCA0NDguMjk0IDE1MC4zNzQgTCA0ODEuMjYzIDEwNy41MzEgTCA1MTQuMjMgNjQu
Njg5IEwgNTM4LjI0MyAzMy41OCBMIDU2Mi4yNTQgMi40NyBMIDU2Mi4wMTcgMi4wODggTCA1NjEu
NzgxIDEuNzA2IFoiIHN0eWxlPSJmaWxsOiB1cmwoJnF1b3Q7I2xpbmVhckdyYWRpZW50Mzk1NyZx
dW90Oyk7IHN0cm9rZS13aWR0aDogMS4wNjYzNzsiIGlkPSJwYXRoMzk1NyIvPgogIDwvZz4KPC9z
dmc+Cg==`.replace(/[\s\n]+/gu, '');

/** Extracts the size from a string, or returns a fallback. */
const extractSize = function extractSize({
  record,
  aliases,
  path,
}: Readonly<
  Omit<Parameters<typeof Component.utils.extract>[0], 'fallback'> & {
    path: Component.Interface['path'];
  }
>): SlydeHtmlDocumentHtmlProperties['size'] {
  const size = Component.utils.extract({
    aliases,
    fallback: DEFAULT_SIZE,
    record,
  });

  const regex = /(?<width>\d+)x(?<height>\d+)/iu;
  const match = regex.exec(size);
  if (match?.groups) {
    const height = parseInt(match.groups.height, 10);
    const width = parseInt(match.groups.width, 10);
    return { height, width };
  }

  throw new Error(
    `Expected size property to be of the form ${regex}, but found "${size}" at ${path.join('.')}`
  );
};

/**
 * The encompassing `Presentation` object. Should hold all slides.
 */
@Component.register.using({ plugin: false })
export class Presentation
  extends Component
  implements Omit<SlydeHtmlDocumentHtmlProperties, 'content'>
{
  public readonly title: string;
  public readonly icon: string;
  public readonly authors: readonly string[];
  public readonly description: string;
  public readonly keywords: readonly string[];
  public readonly background: string;
  public readonly foreground: string;
  public readonly nonce?: string | undefined;
  public readonly primary: string;
  public readonly secondary: string;
  public readonly size: { readonly height: number; readonly width: number };

  // eslint-disable-next-line jsdoc/require-jsdoc, max-lines-per-function
  public constructor(args: Component.ConstructorArguments) {
    super(args);

    this.title = Component.utils.extract({
      aliases: ['title'],
      fallback: DEFAULT_TITLE,
      record: args.attributes,
    });

    this.description = Component.utils.extract({
      aliases: ['description', 'alt'],
      fallback: DEFAULT_DESCRIPTION,
      record: args.attributes,
    });

    this.authors = Component.utils
      .extract({
        aliases: ['authors', 'author', 'by'],
        fallback: DEFAULT_AUTHOR,
        record: args.attributes,
      })
      .split(',');

    this.keywords = Component.utils
      .extract({
        aliases: ['keywords', 'tags'],
        fallback: DEFAULT_KEYWORDS,
        record: args.attributes,
      })
      .split(',');

    this.icon = Component.utils.extract({
      aliases: ['icon'],
      fallback: DEFAULT_ICON_URL,
      record: args.attributes,
    });

    this.background = Component.utils.extract({
      aliases: ['background', 'background-color'],
      fallback: DEFAULT_BACKGROUND,
      record: args.attributes,
    });

    this.foreground = Component.utils.extract({
      aliases: ['foreground', 'foreground-color'],
      fallback: DEFAULT_FOREGROUND,
      record: args.attributes,
    });

    this.primary = Component.utils.extract({
      aliases: ['primary', 'primary-color'],
      fallback: DEFAULT_PRIMARY,
      record: args.attributes,
    });

    this.secondary = Component.utils.extract({
      aliases: ['secondary', 'secondary-color'],
      fallback: DEFAULT_SECONDARY,
      record: args.attributes,
    });

    this.size = extractSize({
      aliases: ['size'],
      path: this.path,
      record: args.attributes,
    });
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({
    children,
  }: Component.RenderArguments): ReturnType<Component.Interface['render']> {
    if (!children) {
      throw new Error(
        `${Component.name} ${Presentation.name} expected to have children, but found none at ${this.path.join('.')}.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    const content = /*HTML*/ `
      <main>
        ${children()}
      </main>
    `;

    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    return this.htmlDocument({ ...this, content });
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component.Interface['hierarchy']> {
    return [Component.level.presentation];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public htmlDocument(arg0: SlydeHtmlDocumentHtmlProperties): ReturnType<typeof htmlDocument> {
    return htmlDocument({ ...arg0 });
  }
}
