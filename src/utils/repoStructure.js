const fs = require('fs/promises');
const path = require('node:path');

// Orden personalizado para directorios principales
const directoryOrder = ['.vscode', 'data', 'public', 'src', 'tests'];

// Mapeo de extensiones a iconos
const iconMap = {
    '.js': '📄', // Archivo JavaScript
    '.json': '🔧', // Archivo JSON (configuración)
    '.md': '📝', // Archivo Markdown
    '.html': '🌐', // Archivo HTML
    '.css': '🎨', // Archivo CSS
    '.test.js': '🧪', // Archivo de prueba
    '.gitignore': '👁️', // Archivo .gitignore
    '.env': '🔒', // Archivo .env
    'folder': '📁', // Carpeta por defecto
    'default': '📄', // Archivo por defecto
};

function getIcon(name, isDirectory) {
    if (isDirectory) return iconMap['folder'];
    const ext = path.extname(name);
    if (name.endsWith('.test.js')) return iconMap['.test.js'];
    return iconMap[ext] || iconMap[name] || iconMap['default'];
}

async function generateRepoStructure(startPath, ignore = []) {
    let structure = '';
    
    async function buildStructure(currentPath, indent = '', isRoot = false) {
        const items = await fs.readdir(currentPath);
        
        const directories = [];
        const files = [];
        
        for (const item of items) {
            if (ignore.includes(item)) continue;
            
            const fullPath = path.join(currentPath, item);
            const stat = await fs.stat(fullPath);
            
            if (stat.isDirectory()) {
                directories.push(item);
            } else {
                files.push(item);
            }
        }
        
        directories.sort((a, b) => {
            const indexA = directoryOrder.indexOf(a);
            const indexB = directoryOrder.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
        
        files.sort((a, b) => a.localeCompare(b));
        
        for (let i = 0; i < directories.length; i++) {
            const dir = directories[i];
            const fullPath = path.join(currentPath, dir);
            structure += `${indent}${getIcon(dir, true)} ${dir}/\n`;
            await buildStructure(fullPath, indent + ' ', false);
            
            // Agregar línea de separación después de cada subcarpeta
            if (!isRoot) {
                structure += `${indent} ${'-'.repeat(20)}\n`;
            }
            
            // Agregar línea de separación después de cada carpeta principal
            if (isRoot) {
                structure += `${indent}${'-'.repeat(20)}\n`;
                structure += `${indent}${'-'.repeat(20)}\n`;
            }
        }
        
        for (const file of files) {
            structure += `${indent}${getIcon(file)} ${file}\n`;
        }
    }
    
    await buildStructure(startPath, '', true);
    return structure;
}

async function updateRepoStructure() {
    try {
        const ignoreList = [
            'node_modules',
            '.git',
            'logs',
            'package-lock.json',
        ];
        
        const structure = await generateRepoStructure(
            path.join(__dirname, '../..'), 
            ignoreList
        );
        
        const content = `# Estructura del Repositorio

\`\`\`
${structure}
\`\`\`

Última actualización: ${new Date().toLocaleString()}
`;
        
        await fs.writeFile(
            path.join(__dirname, '../../', 'repoStructure.md'),
            content
        );
        
        console.log('Estructura del repositorio actualizada exitosamente.');
    } catch (error) {
        console.error('Error al actualizar la estructura:', error);
    }
}

updateRepoStructure();
module.exports = updateRepoStructure;