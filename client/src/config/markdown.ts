import MarkdownIt from "markdown-it";
import markdownItContainer from "markdown-it-container";
import hljs from "highlight.js/lib/common";

const md: MarkdownIt = MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `
          <pre class="hljs">
            <code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code>
          </pre>
        `;
        // eslint-disable-next-line
      } catch {}
    }

    return `
      <pre class="hljs">
        <code>${md.utils.escapeHtml(str)}</code>
      </pre>
    `;
  }
});

md.use(markdownItContainer, "warning");

export default md;
