// Importando as lib's necessárias.
const pdfjsLib = require('pdfjs-dist');
const path = require("path");

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname,'../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController{ 
    constructor(file){

        this._file = file; // Colando em um atributo, o parametro recebido, para utilização dos demais métodos.

    }

    getPreviewData(){

        return new Promise((s,f)=>{

            let reader = new FileReader();

            // Selecionando os tipos a serem visualidos pelo navegador (Imagens e PDFS);

            switch (this._file.type) {
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/gif':
                    reader.onload = e =>{
                        s({
                            src: reader.result, // Rederinzar o resultado, dentor do <img>, no atributo src.
                            info: this._file.name // Mostrar o nome.
                        });
                    }

                    reader.onerror = err =>{
                        f(err); // Em caso de erro.
                    }

                    reader.readAsDataURL(this._file); // Leitura de fato do documento.

                break;

                case 'application/pdf':
                
                // Para trabalharmos com PDF, utilizaremos a biblioteca PDF.JS.
    
                reader.onload = () =>{

                    // Selecionando o documento. Porém o metodo da biblioteca, le apenas um array de outros bits.
                    // É necessario uma conversão, retornando uma promessa.

                    pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf =>{

                        // Selecionando a primeira pagina.
                        pdf.getPage(1).then(page =>{

                            // Semelhante a camera, utilizamos um canvas para desenhar a imagem na tela.

                            let viewport = page.getViewport(1); // indicando que deve ser mostrado a primeira pagina.
                            let canvas = document.createElement('canvas');
                            let canvasContext = canvas.getContext('2d');

                            canvas.width = viewport.width; // Definindo a largura da imagem a ser mostrada.
                            canvas.height = viewport.height; // Definindo a altura da imagem a ser mostrada.

                            page.render({

                                // JSON, com mesmo nome de chave e atributo, não necessitam de repetição.

                                canvasContext,
                                viewport

                            }).then(()=>{

                                let _s = (pdf.numPages > 1) ? 's' : ''; // Se for mais de uma pagina 'S'. Se não o mantem no singular.

                                s({
                                    src: canvas.toDataURL('image/png'), // Ordenando desenhar no formato PNG.
                                    info: `${pdf.numPages } página${_s}` // Informando na tela o número de pagina(s).
                                });

                            }).catch(err =>{
                                f(err); // Em caso de erro.
                            
                            });

                        }).catch(err =>{
                            f(err); // Em caso de erro.
                        });


                    }).catch(err =>{
                        f(err); // Em caso de erro.
                    });


                };

                // Leitura de cada pagina, colocando em um array.
                reader.readAsArrayBuffer(this._file);

                    break;
            
                default:
                
                    f(); // Em caso de erro.

                    break;
            }

        });

    }
}