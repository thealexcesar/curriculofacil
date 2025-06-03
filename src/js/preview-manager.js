import AppState from './app-app-state.js';
import { formatDate } from './utils.js';

/**
 * Manages the preview, export, and printing of the resume
 */
const PreviewManager = {
    init() {
        document.getElementById('export-pdf').addEventListener('click', () => this.exportPDF());
        document.getElementById('print-resume').addEventListener('click', () => this.printResume());
    },

    updatePreview() {
        const preview = document.getElementById('cv-preview');
        const { personalInfo, profile, experience, education, skills, languages } = AppState.data;

        if (!personalInfo.name) {
            preview.innerHTML = `<div class="text-center text-gray-500 py-20">Preencha as informações para ver a visualização do seu currículo</div>`;
            return;
        }

        let html = `
            <div class="cv-container">
                <div class="cv-header border-b pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">${personalInfo.name || ''}</h1>
                    <p class="text-xl text-blue-600 font-medium mt-1">${personalInfo.title || ''}</p>

                    <div class="flex flex-wrap gap-x-4 mt-3 text-sm text-gray-600">
                        ${personalInfo.email ? `<div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>${personalInfo.email}</div>` : ''}
                        ${personalInfo.phone ? `<div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>${personalInfo.phone}</div>` : ''}
                        ${personalInfo.location ? `<div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${personalInfo.location}</div>` : ''}
                        ${personalInfo.linkedin ? `<div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="${personalInfo.linkedin}" target="_blank" class="text-blue-600 hover:underline">${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div>` : ''}
                    </div>
                </div>
        `;

        if (profile) {
            html += `
                <div class="cv-profile mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Perfil Profissional</h2>
                    <p class="text-gray-700">${profile}</p>
                </div>
            `;
        }

        if (experience && experience.length > 0) {
            html += `
                <div class="cv-experience mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Experiência Profissional</h2>
                    <div class="space-y-4">
            `;

            experience.forEach(exp => {
                if (exp.title || exp.company) {
                    html += `
                        <div class="experience-entry">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-medium text-gray-800">${exp.title}</h3>
                                    <p class="text-gray-600">${exp.company}</p>
                                </div>
                                <div class="text-sm text-gray-500">
                                    ${formatDate(exp.startDate)} - ${exp.current ? 'Atual' : formatDate(exp.endDate)}
                                </div>
                            </div>
                            ${exp.description ? `<p class="mt-2 text-gray-700">${exp.description}</p>` : ''}
                        </div>
                    `;
                }
            });

            html += `
                    </div>
                </div>
            `;
        }

        if (education && education.length > 0) {
            html += `
                <div class="cv-education mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Educação</h2>
                    <div class="space-y-4">
            `;

            education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `
                        <div class="education-entry">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-medium text-gray-800">${edu.degree}</h3>
                                    <p class="text-gray-600">${edu.institution}</p>
                                </div>
                                <div class="text-sm text-gray-500">
                                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                                </div>
                            </div>
                            ${edu.description ? `<p class="mt-2 text-gray-700">${edu.description}</p>` : ''}
                        </div>
                    `;
                }
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';

        if (skills && skills.length > 0) {
            html += `
                <div class="cv-skills">
                    <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Habilidades</h2>
                    <div class="flex flex-wrap gap-2">
            `;

            skills.forEach(skill => {
                html += `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${skill}</span>`;
            });

            html += `
                    </div>
                </div>
            `;
        }

        if (languages && languages.length > 0) {
            html += `
                <div class="cv-languages">
                    <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Idiomas</h2>
                    <div class="space-y-2">
            `;

            languages.forEach(language => {
                html += `
                    <div class="flex justify-between">
                        <span class="text-gray-700">${language.name}</span>
                        <span class="text-gray-500">${language.level}</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += '</div></div>';
        preview.innerHTML = html;
    },

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('cv-preview');

        html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            const height = (canvas.height * width) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save('curriculo.pdf');
        });
    },

    printResume() {
        window.print();
    }
};

export default PreviewManager;