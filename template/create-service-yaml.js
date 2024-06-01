const fs = require('fs');
const path = require('path');

const createServiceYaml = (helmDir, serviceName) => {
    const serviceYamlContent = `
apiVersion: v1
kind: Service
metadata:
  name: {{ include "${serviceName}.fullname" . }}
  labels:
    {{- include "${serviceName}.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: 3000
  selector:
    {{- include "${serviceName}.selectorLabels" . | nindent 4 }}
  `;
    fs.writeFileSync(path.join(helmDir, 'templates', 'service.yaml'), serviceYamlContent.trim());
};

module.exports = createServiceYaml;
