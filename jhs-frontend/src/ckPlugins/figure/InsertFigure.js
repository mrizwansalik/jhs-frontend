import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { toggleModal } from 'helpers/globalHelpers';
import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

class InsertFigure extends Plugin {
    init() {
        const editor = this.editor;
        // The button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('insertFigure', () => {
            // The button will be an instance of ButtonView.
            const button = new ButtonView();

            button.set({
                label: 'Insert Figure',
                withText: true,
                icon: checkIcon
            });

            button.on('execute', () => {
              toggleModal('#insertFigureWidget');
                
                // Change the model using the model writer.
                // editor.model.change(writer => {

                //     // Insert the text at the user's current position.
                //     editor.model.insertContent(writer.createText(now.toString()));
                // });
            });


            return button;
        });
    }
}

export default InsertFigure;