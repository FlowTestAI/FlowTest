import { useState } from "react";

//mui
import { Fab } from "@mui/material";
import { blue, green } from '@mui/material/colors';

// icons
import { IconMinus, IconPlus } from '@tabler/icons-react';

const fabStyle = {
    position: 'absolute',
    bottom: 20,
    right: 15,
}
  
const fabGreenStyle = {
    color: 'common.white',
    bgcolor: blue[500],
    '&:hover': {
        bgcolor: blue[600],
    },
}

const AddRequestNodes = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Fab
                color= 'inherit'
                aria-label='Add'
                title="Add Node"
                sx= {{ ...fabStyle, ...fabGreenStyle }}
                onClick={() => setOpen(!open)}
            >
                {open ? <IconMinus /> : <IconPlus />}
            </Fab>
        </>
    )
}

export default AddRequestNodes;