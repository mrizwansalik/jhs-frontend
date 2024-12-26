
/* eslint-disable */
import React from 'react';
import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';

const InputSelect = ({
    options = '',
    className = '',
    label = '',
    name = '',
    propOnChange = '',
    control = '',
    errors = '',
    isMulti = false,
    defValue = '',
    placeholder = '',
    propValue = 'custom',
    propRef = '',

}) => {

    const colourStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: '#1a1a1a',
                borderColor: '#1a1a1a'
            };
        }
    };

    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <img src="/assets/images/drop-down-arrow.svg" />
            </components.DropdownIndicator>
        );
    };
    return (
        <>
            <Controller
                control={control}
                name={name}
                rules={{ required: { value: true, message: `${name} is required` }, validate: {} }}
                defaultValue={defValue?._id ? defValue?._id : ''}
                render={({ field: { onChange, value, ref } }) => (
                    <Select
                        components={{ DropdownIndicator }}
                        styles={colourStyles}
                        getOptionLabel={(e) => (
                            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                {e.icon}
                                <span className="select-title">{e.label}</span>
                                <span className="select-slug">{e.slug}</span>
                            </div>
                        )}
                        placeholder={placeholder}
                        ref={propRef ? propRef : ref}
                        options={options}
                        isMulti={isMulti}
                        defaultValue={() => (defValue ? { label: defValue?.name || defValue?.title, value: defValue?._id } : '')}
                        onChange={(val) => onChange((value = val.value), propOnChange && propOnChange(val))}
                        error={!!errors.name}
                        value={propValue ? options?.find((c) => c.value === value) : ''}
                    />
                )}
            />{' '}
            <div className="invalid-feedback">{errors.name?.message}</div>
        </>

    );
};

export default InputSelect;