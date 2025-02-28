import React, {FC} from 'react'

type Props = {
    open: boolean,
    setOpen: (value: boolean) => void,
    activeItem: number,
}

const Header:FC<Props> = (props) => {
    return (
        <div>Hola</div>
    );
};

export default Header;