const fs = require("fs");
const path = require("path");


const createHelpersTpl = (helmDir, serviceName) => {
    const helpersTplContent = `
{{- define "${serviceName}.labels" -}}
app.kubernetes.io/name: {{ include "${serviceName}.name" . }}
helm.sh/chart: {{ include "${serviceName}.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "${serviceName}.selectorLabels" -}}
app.kubernetes.io/name: {{ include "${serviceName}.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "${serviceName}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "${serviceName}.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "${serviceName}.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := include "${serviceName}.name" . }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end -}}
  `;
    fs.writeFileSync(path.join(helmDir, 'templates', '_helpers.tpl'), helpersTplContent.trim());
};

module.exports = createHelpersTpl;
