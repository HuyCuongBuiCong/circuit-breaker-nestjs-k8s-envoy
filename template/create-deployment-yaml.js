const fs = require('fs');
const path = require('path');

const createDeploymentYaml = (helmDir, serviceName) => {
    const deploymentYamlContent = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${serviceName}.fullname" . }}
  labels:
    {{- include "${serviceName}.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "${serviceName}.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "${serviceName}.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "development"
            - name: PORT
              value: "3000"
          command: ["node", "dist/main"]  
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
  `;
    fs.mkdirSync(path.join(helmDir, 'templates'), { recursive: true });
    fs.writeFileSync(path.join(helmDir, 'templates', 'deployment.yaml'), deploymentYamlContent.trim());
};

module.exports = createDeploymentYaml;
