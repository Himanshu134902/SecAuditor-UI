export const mockScanResult = {
  testedUrl: "https://example.com",
  score: 65,
  grade: "C",
  scannedAt: new Date().toISOString(),
  findings: [
    {
      ruleId: "csp",
      name: "Content-Security-Policy",
      status: "FAIL",
      category: "INJECTION",
      severity: "HIGH",
      message: "Missing Content Security Policy. Leaves site vulnerable to Cross-Site Scripting (XSS).",
      currentValue: null,
      remediation: {
        express: "app.use(helmet.contentSecurityPolicy());",
        nginx: "add_header Content-Security-Policy \"default-src 'self';\" always;"
      }
    },
    {
      ruleId: "hsts",
      name: "Strict-Transport-Security (HSTS)",
      status: "FAIL",
      category: "ENCRYPTION",
      severity: "HIGH",
      message: "HSTS not enforced. Connection vulnerable to SSL-stripping and MitM attacks.",
      currentValue: null,
      remediation: {
        express: "app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));",
        nginx: "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;"
      }
    },
    {
      ruleId: "xfo",
      name: "X-Frame-Options",
      status: "PASS",
      category: "CLICKJACKING",
      severity: "MEDIUM",
      message: "Framing protections active.",
      currentValue: "SAMEORIGIN",
      remediation: null
    },
    {
      ruleId: "xcto",
      name: "X-Content-Type-Options",
      status: "PASS",
      category: "MIME",
      severity: "LOW",
      message: "MIME sniffing disabled.",
      currentValue: "nosniff",
      remediation: null
    },
    {
      ruleId: "info_leak",
      name: "Server Version Disclosure",
      status: "WARN",
      category: "DISCLOSURE",
      severity: "LOW",
      message: "Web server software version is exposed to visitors.",
      currentValue: "Server: Apache/2.4.41",
      remediation: {
        express: "app.disable('x-powered-by');",
        nginx: "server_tokens off;"
      }
    }
  ]
};