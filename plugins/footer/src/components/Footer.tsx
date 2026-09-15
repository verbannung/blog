import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import style from "./styles/footer.scss";

export interface FooterOptions {
  /** Contact email shown in the footer. */
  email?: string;
  links?: Record<string, string>;
}

const DEFAULT_EMAIL = "verbannung@yeah.net";

export default ((opts?: FooterOptions) => {
  const email = opts?.email ?? DEFAULT_EMAIL;
  const links = opts?.links ?? {};

  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    );
  };

  Footer.css = style;
  return Footer;
}) satisfies QuartzComponentConstructor;
