import { style } from "@vanilla-extract/css";

export const UserListStyle = style({
    display: 'grid',
    width : '90vw',
    gridTemplateColumns: '1fr 4fr 3fr 2fr 2fr 2fr', 
    fontWeight: 'bold',
    marginLeft : '10px',
});

export const UserListDetail = style({
    display: 'grid',
    gridTemplateColumns: '1fr 4fr 3fr 2fr 2fr 2fr',
    alignItems: 'center',
    marginBottom: '10px',
    marginLeft : '10px',
});

export const UserListPage = style({ 
    marginTop: '16px' ,
    marginRight : '10px'
});

export const PageBtn = style({ 
    marginRight : '10px'
});

export const SearchUser = style({
    display: 'flex',       
    justifyContent: 'flex-end', 

});

export const UserSearchInput = style({
    marginRight: '8px' 
});

export const deleteButton = style({
    backgroundColor: '#A52A2A', 
    color: '#ffffff', 
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    ':hover': {
        backgroundColor: '#800000',
    },
});

export const restoreButton = style({
    backgroundColor: '#5A78AF',
    color: '#ffffff', 
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    ':hover': {
        backgroundColor: '#0047AB',
    },
});

