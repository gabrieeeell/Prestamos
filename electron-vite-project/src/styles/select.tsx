export const colorStyles = {
    menu: (styles: any) => ({
        ...styles,
        width: '95%',
        marginTop: 0,
        borderRadius:"0.6rem"
      }),
    control:(style: any,state: any) => ({
        ...style,
        background: "#272727",
        width: "95%",
        height: "2.6rem",
        ...style,
        borderColor: state.isFocused ? "#727272" : "#3d3d3d",
        boxShadow: state.isFocused ? '0 0 0 0px #272727' : style.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? "#727272" : "#3d3d3d",
    },
    borderRadius: "0.5rem"
        
    }),
    singleValue: (styles: any) => ({
        ...styles,
        color:"#bebebe",
        fontWeight: 600,
        
    }),
    menuList: (styles: any) => ({
        ...styles,
        color:"#bebebe",
        fontWeight: 400,
        padding: 0,
        borderRadius: "0.4rem"
    }),
    option: (styles: any,state:any,) => ({
        ...styles,
        background: "#272727",
        backgroundColor: state.isFocused ? '#313131' : '#272727',
        color: '#bebebe',
        '&:hover': {
            backgroundColor: state.isFocused ? '#313131' : "#272727",
    }
        
      }),
}

export const ordenarPorStyles = {
    container: (styles : any) => ({
        ...styles,
        width: "19rem",  
      }),
    menu: (styles: any) => ({
        ...styles,
        width: '19rem',
        marginTop: 0,
        borderRadius:"0.6rem"
      }),
    control:(style: any,state: any) => ({
        ...style,
        background: "#333333",
        width: "19rem",
        height: "2.6rem",
        border: 0,
        ...style,
        borderColor: state.isFocused ? "#727272" : "#3d3d3d",
        boxShadow: state.isFocused ? '0 0 0 0px #272727' : style.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? "#727272" : "#3d3d3d",
    },
    borderRadius: "0.5rem"
        
    }),
    singleValue: (styles: any) => ({
        ...styles,
        color:"#bebebe",
        fontWeight: 600,
        
    }),
    menuList: (styles: any) => ({
        ...styles,
        color:"#333333",
        fontWeight: 400,
        padding: 0,
        borderRadius: "0.4rem"
    }),
    option: (styles: any,state:any,) => ({
        ...styles,
        background: "#333333",
        backgroundColor: state.isFocused ? '#313131' : '#272727',
        color: '#bebebe',
        '&:hover': {
            backgroundColor: state.isFocused ? '#313131' : "#272727",
    }
        
      }),
}