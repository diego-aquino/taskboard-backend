const docsConfig = {
  customSwaggerCss: `
    @import url(
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap'
    );

    .responses-wrapper > .responses-inner td.response-col_description {
      padding-top: 0;
    }

    .responses-wrapper > .responses-inner td.response-col_status,
    .responses-wrapper > .responses-inner td.response-col_links {
      padding-top: 1rem;
    }

    .responses-wrapper > .responses-inner td.response-col_status {
      font-weight: bold;
      font-size: 1rem;
      min-width: 5em;
    }

    .opblock-section > div.opblock-section.opblock-section-request-body pre,
    .responses-wrapper > .responses-inner td.response-col_description pre {
      min-height: 0;
      padding: 1rem !important;
    }

    .opblock-section > div.opblock-section.opblock-section-request-body pre
      code,
    .responses-wrapper > .responses-inner td.response-col_description pre
      code {
      font-family: 'JetBrains Mono', monospace;
    }

    .responses-wrapper > .responses-inner td.response-col_description
      > div:last-of-type {
      padding-bottom: 1.5rem;
    }

    .responses-wrapper > .responses-inner td.response-col_description
      > div.response-col_description__inner > div > p {
      margin: 1rem auto 0;
    }
  `,
};

export default docsConfig;
