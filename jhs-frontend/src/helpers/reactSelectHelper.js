/* eslint-disable */
import { useEffect } from 'react';
import Select, { components } from 'react-select';

export const reactSelectScript = () => {
    const script = document.createElement('script');
    script.src = `${window.location.origin}${import.meta.env.VITE_PUBLIC_URL}/assets/tooltip/initiate.js`;
    script.async = true;
    return document.body.appendChild(script);
};

export const dropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img src="/assets/images/drop-down-arrow.svg" />
        </components.DropdownIndicator>
    );
};

export const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: '#1a1a1a',
            borderColor: '#1a1a1a',
        };
    },
};

export const selectedOptions = (obj) => {
    const arr = [];
    obj?.map((item) => {
        arr.push({
            label: item.name,
            value: item._id,
            slug: item.code,
            icon: <img className="select-img" alt="" src="./assets/images/bitcoin-icon.png" />,
        });
    });
    return arr;
};

export default function useEvent(event, handler) {
    useEffect(() => {
      window.addEventListener(event, handler)
      return () => {
        window.removeEventListener(event, handler)
      }
    })
  }