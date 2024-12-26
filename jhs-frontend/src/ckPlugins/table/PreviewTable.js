// ckeditor/productpreviewediting.js

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget';

import InsertDataCommand from './InsertDataCommand';

export default class PreviewTable extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('insertData', new InsertDataCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('tablePreview', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',

            // Each product preview has an ID. A unique ID tells the application which
            // product it represents and makes it possible to render it inside a widget.
            allowAttributes: ['id', 'data']
        });

    }

    _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;
        const renderTable = editor.config.get('tables').tableRenderer;
        const renderinitialTables = editor.config.get('tableData');

        // <productPreview> converters ((data) view → model)
        conversion.for('upcast').elementToElement({
            view: {
                name: 'section',
                classes: 'onnmed-table'
                // classes: 'product'
            },

            model: (viewElement, { writer: modelWriter }) => {
              
                // let data  = 
                // Read the "data-id" attribute from the view and set it as the "id" in the model.
                return modelWriter.createElement('tablePreview', {
                    // id: parseInt(viewElement.getAttribute('data-id'))
                    id: (viewElement.getAttribute('data-id')),
                    data: renderinitialTables?.find((data) => data._id === (viewElement.getAttribute('data-id')))
                });
            }
        });

        // <productPreview> converters (model → data view)
        conversion.for('dataDowncast').elementToElement({
            model: 'tablePreview',
            view: (modelElement, { writer: viewWriter }) => {
                // In the data view, the model <productPreview> corresponds to:
                //
                // <section class="product" data-id="..."></section>
                // debugger
                return viewWriter.createEmptyElement('section', {
                    class: 'onnmed-table',
                    'data-id': modelElement.getAttribute('id'),
                    'widget-type': 'table'
                    // 'data': "test data of ck ediytor"
                });
            }
        });

        // <productPreview> converters (model → editing view)
        conversion.for('editingDowncast').elementToElement({
            model: 'tablePreview',
            view: (modelElement, { writer: viewWriter }) => {
                // In the editing view, the model <productPreview> corresponds to:
                //
                // <section class="product" data-id="...">
                //     <div class="product__react-wrapper">
                //         <ProductPreview /> (React component)
                //     </div>
                // </section>
                const id = modelElement.getAttribute('id');
                const data = modelElement.getAttribute('data') ?? '';
                // The outermost <section class="product" data-id="..."></section> element.
                const section = viewWriter.createContainerElement('section', {
                    class: 'onnmed-table',
                    'data-id': id,
                });


                // The inner <div class="product__react-wrapper"></div> element.
                // This element will host a React <ProductPreview /> component.
                const reactWrapper = viewWriter.createRawElement('div', {
                    class: 'onnmed-table__react-wrapper'
                }, function (domElement) {
                    // This the place where React renders the actual product preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.products#productRenderer.
                    renderTable(id, data, domElement, editor);

                });

                const item = viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper);

                return toWidget(section, viewWriter, { label: 'product preview widget' });
            }
        });
    }
}
