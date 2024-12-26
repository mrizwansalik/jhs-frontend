// ckeditor/insertproductpreviewcommand.js

import { Command } from '@ckeditor/ckeditor5-core';

export default class InsertFigureDataCommand extends Command {
    execute( data ) {

        this.editor.model.change( writer => {
            // Insert <productPreview id="...">*</productPreview> at the current selection position
            // in a way which will result in creating a valid model structure.
            // this.editor.model.insertContent( writer.createElement( 'figurePreview', { id: data.id } ) );
            // const get = writer.createElement( 'figurePreview', data )
            const re = this.editor.model.insertContent( writer.createElement( 'figurePreview', data ) );
            // debugger
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'figurePreview' );

        this.isEnabled = allowedIn !== null;
    }
}
