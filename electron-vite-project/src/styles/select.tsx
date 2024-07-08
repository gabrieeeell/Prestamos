export const colorStyles = {
    menu: (styles: any) => ({
        ...styles,
        width: '95%',
        marginTop: 0,
      }),
    control:(style: any,state: any) => ({
        ...style,
        background: "#272727",
        width: "95%",
        ...style,
        borderColor: state.isFocused ? "#272727" : "#272727",
        boxShadow: state.isFocused ? '0 0 0 0px #272727' : style.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? "#272727" : "#272727",
    }
        
    }),
    singleValue: (styles: any) => ({
        ...styles,
        color:"#fff",
        fontWeight: 600,
    }),
    menuList: (styles: any) => ({
        ...styles,
        color:"#fff",
        fontWeight: 400,
        padding: 0,
    }),
    option: (styles: any,state:any,) => ({
        ...styles,
        background: "#272727",
        backgroundColor: state.isFocused ? '#313131' : '#272727',
        color: '#fff',
        '&:hover': {
            backgroundColor: state.isFocused ? '#313131' : "#272727",
    }
        
      }),
      


}