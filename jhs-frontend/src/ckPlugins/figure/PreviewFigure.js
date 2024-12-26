// ckeditor/figurepreviewediting.js

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget';

import InsertFigureDataCommand from './InsertFigureDataCommand';

export default class PreviewFigure extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertFigureData', new InsertFigureDataCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('figurePreview', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',

            // Each figure preview has an ID. A unique ID tells the application which
            // figure it represents and makes it possible to render it inside a widget.
            allowAttributes: ['id', 'data']
        });

    }

    _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;
        const renderFigure = editor.config.get('figures').figureRenderer;
        const renderinitialFigures = editor.config.get('figureData');

        // <figurePreview> converters ((data) view → model)
        conversion.for('upcast').elementToElement({
            view: {
                name: 'section',
                classes: 'onnmed-figure'
            },

            model: (viewElement, { writer: modelWriter }) => {
              
                // let data  = 
                // Read the "data-id" attribute from the view and set it as the "id" in the model.
                return modelWriter.createElement('figurePreview', {
                    // id: parseInt(viewElement.getAttribute('data-id'))
                    id: (viewElement.getAttribute('data-id')),
                    data: renderinitialFigures?.find((data) => data._id === (viewElement.getAttribute('data-id')))
                });
            }
        });

        // <figurePreview> converters (model → data view)
        conversion.for('dataDowncast').elementToElement({
            model: 'figurePreview',
            view: (modelElement, { writer: viewWriter }) => {
                // In the data view, the model <figurePreview> corresponds to:
                //
                // <section class="figure" data-id="..."></section>
                // debugger
                return viewWriter.createEmptyElement('section', {
                    class: 'onnmed-figure',
                    'data-id': modelElement.getAttribute('id'),
                    'widget-type': 'figure'
                    // 'data': "test data of ck ediytor"
                });
            }
        });

        // <figurePreview> converters (model → editing view)
        conversion.for('editingDowncast').elementToElement({
            model: 'figurePreview',
            view: (modelElement, { writer: viewWriter }) => {
                // In the editing view, the model <figurePreview> corresponds to:
                //
                // <section class="figure" data-id="...">
                //     <div class="figure__react-wrapper">
                //         <FigurePreview /> (React component)
                //     </div>
                // </section>
                const id = modelElement.getAttribute('id');
                const data = modelElement.getAttribute('data') ?? '';
                // The outermost <section class="figure" data-id="..."></section> element.
                const section = viewWriter.createContainerElement('section', {
                    class: 'onnmed-figure',
                    'data-id': id,
                });


                // The inner <div class="figure__react-wrapper"></div> element.
                // This element will host a React <FigurePreview /> component.
                const reactWrapper = viewWriter.createRawElement('div', {
                    class: 'onnmed-figure__react-wrapper'
                }, function (domElement) {
                    // This the place where React renders the actual figure preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.figures#figureRenderer.
                    renderFigure(id, data, domElement, editor);

                });

                const item = viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper);

                return toWidget(section, viewWriter, { label: 'figure preview widget' });
            }
        });
    }
}
