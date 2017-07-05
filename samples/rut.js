var util = require('util');
var builder = require('botbuilder');
var LuisActions = require('../core');

var crearRut = {
	intentName: 'CrearRut',
    friendlyName: 'Creación de RUT',
    confirmOnContextSwitch: true,
    schema: {
    	TipoDoc: {
    		type: 'string',
            message: 'Por favor ingrese su tipo de documento'
    	},
    	Documento: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el número de documento'
    	},
    	FechaExp: {
    		type: 'date',
            builtInType: LuisActions.BuiltInTypes.DateTime.Date,
            validDate: true, 
            message: 'Por favor ingrese la fecha de expedición de su documento'
    	},
    	PaisExp: {
    		type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.Country,
            message: 'Por favor ingrese el país donde se expide su documento'
    	},
    	DptoExp: {
    		type: 'string',
            message: 'Por favor ingrese el departamento donde se expide su documento'
    	},
    	MpioExp: {
    		type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Por favor ingrese la ciudad o el municipio donde se expide su documento'
    	},
    	Apellido1: {
    		type: 'string',
            message: 'Por favor ingrese su primer apellido'
    	},
    	Apellido2: {
    		type: 'string',
            message: 'Por favor ingrese su segundo apellido'
    	},
    	Nombre1: {
    		type: 'string',
            message: 'Por favor ingrese su primer nombre'
    	},
    	Nombre2: {
    		type: 'string',
            message: 'Por favor ingrese su segundo nombre'
    	},
    	PaisUbi: {
    		type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.Country,
            message: 'Por favor ingrese el país donde reside'
    	},
    	DptoUbi: {
    		type: 'string',
            message: 'Por favor ingrese el departamento donde reside'
    	},
    	MpioUbi: {
    		type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Por favor ingrese la ciudad o el municipio donde reside'
    	},
    	Direccion: {
    		type: 'string',
            message: 'Por favor ingrese su dirección'
    	},
    	Email: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Email,
            message: 'Por favor ingrese su correo electronico'
    	},
    	Postal: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese su codigo postal'
    	},
    	Telefono1: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese un primer número telefonico'
    	},
    	Telefono2: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese un segundo número telefonico'
    	},
    	ActPrinc: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su actividad principal'
    	},
    	ActSecun: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su actividad secndaria'
    	},
    	OtrasAct: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de otras actividades'
    	},
    	Ocupacion: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su ocupación'
    	},
    	Responsabilidad: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de sus responsabilidades, calidades y atributos'
    	}
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        callback(util.format("Su rut fue creado con exito con los siguientes datos:\nTipo de documento: %s\nDocumento: %s\nFecha de expedición: %s\nPaís expedición: %s\nDepartamento expedición: %s\nMunicipio expedición: %s\nPrimer apellido: %s\nSegundo apellido: %s\nPrimer nombre: %s\nSegundo nombre: %s",
        	parameters.TipoDoc, parameters.Documento, parameters.FechaExp, parameters.PaisExp, parameters.DptoExp, parameters.MpioExp, parameters.Apellido1, parameters.Apellido2, parameters.Nombre1, parameters.Nombre2));
    }
};

var crearRut_cambiarTI = {
	intentName: 'crearRut_cambiarTI',
    friendlyName: 'Cambiar el tipo de documento',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        TipoDoc: {
    		type: 'string',
            message: 'Por favor ingrese su tipo de documento'
    	}
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.TipoDoc = parameters.TipoDoc;
        callback('Tipo de documento cambiado a' + parameters.TipoDoc);
    }
};

var crearRut_cambiarDi= {
	intentName: 'crearRut_cambiarDi',
    friendlyName: 'Cambiar el número de documento',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Documento: {
    		type: 'string',
    		builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el número de documento'
    	}
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Documento = parameters.Documento;
        callback('Número de documento cambiado a' + parameters.Documento);
    }
};

var crearRut_cambiarFechaExp= {
	intentName: 'crearRut_cambiarFechaExp',
    friendlyName: 'Cambiar la fecha de expedición del documento de identidad',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        FechaExp: {
    		type: 'date',
            builtInType: LuisActions.BuiltInTypes.DateTime.Date,
            validDate: true, 
            message: 'Por favor ingrese la fecha de expedición de su documento'
    	}
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.FechaExp = parameters.FechaExp;
        callback('Fecha de expedición cambiada a' + formatDate(parameters.FechaExp));
    }
};

var crearRut_cambiarPaisExp= {
	intentName: 'crearRut_cambiarPaisExp',
    friendlyName: 'Cambiar el país de expedición del documento de identidad',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        PaisExp: {
    		type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.Country,
            message: 'Por favor ingrese el país donde se expide su documento'
    	}
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.PaisExp = parameters.PaisExp;
        callback('País de expedición cambiado a' + parameters.PaisExp);
    }
};

var crearRut_cambiarDptoExp= {
	intentName: 'crearRut_cambiarDptoExp',
    friendlyName: 'Cambiar el departamento de expedición del documento de identidad',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        DptoExp: {
            type: 'string',
            message: 'Por favor ingrese el departamento donde se expide su documento'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.DptoExp = parameters.DptoExp;
        callback('Departamento de expedición cambiado a' + parameters.DptoExp);
    }
};

var crearRut_cambiarMpioExp= {
	intentName: 'crearRut_cambiarMpioExp',
    friendlyName: 'Cambiar el municipio de expedición del documento de identidad',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        MpioExp: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Por favor ingrese la ciudad o el municipio donde se expide su documento'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.MpioExp = parameters.MpioExp;
        callback('Ciudad de expedición cambiado a' + parameters.MpioExp);
    }
};

var crearRut_cambiarApellido1= {
	intentName: 'crearRut_cambiarApellido1',
    friendlyName: 'Cambiar el primer apellido',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
         Apellido1: {
            type: 'string',
            message: 'Por favor ingrese su primer apellido'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Apellido1 = parameters.Apellido1;
        callback('Primer apellido cambiado a' + parameters.Apellido1);
    }
};

var crearRut_cambiarApellido2= {
	intentName: 'crearRut_cambiarApellido2',
    friendlyName: 'Cambiar el segundo apellido',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
         Apellido2: {
            type: 'string',
            message: 'Por favor ingrese su segundo apellido'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Apellido2 = parameters.Apellido2;
        callback('Segundo apellido cambiado a' + parameters.Apellido2);
    }
};

var crearRut_cambiarNombre1= {
	intentName: 'crearRut_cambiarNombre1',
    friendlyName: 'Cambiar el primer nombre',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Nombre1: {
            type: 'string',
            message: 'Por favor ingrese su primer nombre'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Nombre1 = parameters.Nombre1;
        callback('Primer nombre cambiado a' + parameters.Nombre1);
    }
};

var crearRut_cambiarNombre2= {
	intentName: 'crearRut_cambiarNombre2',
    friendlyName: 'Cambiar el segundo nombre',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Nombre2: {
            type: 'string',
            message: 'Por favor ingrese su segundo nombre'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Nombre2 = parameters.Nombre2;
        callback('segundo nombre cambiado a' + parameters.Nombre2);
    }
};

var crearRut_cambiarPaisUbi= {
	intentName: 'crearRut_cambiarPaisUbi',
    friendlyName: 'Cambiar el país donde reside',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        PaisUbi: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.Country,
            message: 'Por favor ingrese el país donde reside'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.PaisUbi = parameters.PaisUbi;
        callback('País de residencia cambiado a' + parameters.PaisUbi);
    }
};

var crearRut_cambiarDptoUbi= {
	intentName: 'crearRut_cambiarDptoUbi',
    friendlyName: 'Cambiar el departamento donde reside',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        DptoUbi: {
            type: 'string',
            message: 'Por favor ingrese el departamento donde reside'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.DptoUbi = parameters.DptoUbi;
        callback('Departamento de residencia cambiado a' + parameters.DptoUbi);
    }
};

var crearRut_cambiarMpioUbi= {
	intentName: 'crearRut_cambiarMpioUbi',
    friendlyName: 'Cambiar el municipio donde reside',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        MpioUbi: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Por favor ingrese la ciudad o el municipio donde reside'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.MpioUbi = parameters.MpioUbi;
        callback('Municipio de residencia cambiado a' + parameters.MpioUbi);
    }
};

var crearRut_cambiarDireccion= {
	intentName: 'crearRut_cambiarDireccion',
    friendlyName: 'Cambiar la dirección de residencia',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Direccion: {
            type: 'string',
            message: 'Por favor ingrese su dirección'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Direccion = parameters.Direccion;
        callback('Dirección de residencia cambiado a' + parameters.Direccion);
    }
};

var crearRut_cambiarEmail= {
	intentName: 'crearRut_cambiarEmail',
    friendlyName: 'Cambiar el correo electronico',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Email: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Email,
            message: 'Por favor ingrese su correo electronico'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Email = parameters.Email;
        callback('Correo electronico cambiado a' + parameters.Email);
    }
};

var crearRut_cambiarPostal= {
	intentName: 'crearRut_cambiarPostal',
    friendlyName: 'Cambiar el codigo postal',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
       Postal: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese su codigo postal'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Postal = parameters.Postal;
        callback('Codigo postal cambiado a' + parameters.Postal);
    }
};

var crearRut_cambiarTelefono1= {
	intentName: 'crearRut_cambiarTelefono1',
    friendlyName: 'Cambiar el primer teléfono',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
       Telefono1: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese un primer número telefonico'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Telefono1 = parameters.Telefono1;
        callback('Primer número telefonico cambiado a' + parameters.Telefono1);
    }
};

var crearRut_cambiarTelefono2= {
	intentName: 'crearRut_cambiarTelefono2',
    friendlyName: 'Cambiar el segundo teléfono',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
       Telefono2: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese un segundo número telefonico'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Telefono2 = parameters.Telefono2;
        callback('Segundo número telefonico cambiado a' + parameters.Telefono2);
    }
};

var crearRut_cambiarActPrinc= {
	intentName: 'crearRut_cambiarActPrinc',
    friendlyName: 'Cambiar la actividad principal',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        ActPrinc: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su actividad principal'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.ActPrinc = parameters.ActPrinc;
        callback('Actividad principal cambiada a' + parameters.ActPrinc);
    }
};

var crearRut_cambiarActSecun= {
	intentName: 'crearRut_cambiarActSecun',
    friendlyName: 'Cambiar la actividad secndaria',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
       ActSecun: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su actividad secndaria'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.ActSecun = parameters.ActSecun;
        callback('Actividad secndaria cambiada a' + parameters.ActPrinc);
    }
};

var crearRut_cambiarOtrasAct= {
	intentName: 'crearRut_cambiarOtrasAct',
    friendlyName: 'Cambiar otras actividades',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
       OtrasAct: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de otras actividades'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.OtrasAct = parameters.OtrasAct;
        callback('Otras actividades cambiada a' + parameters.OtrasAct);
    }
};

var crearRut_cambiarOcupacion= {
	intentName: 'crearRut_cambiarOcupacion',
    friendlyName: 'Cambiar ocupación',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Ocupacion: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de su ocupación'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Ocupacion = parameters.Ocupacion;
        callback('Ocupación cambiada a' + parameters.Ocupacion);
    }
};

var crearRut_cambiarResponsabilidad= {
	intentName: 'crearRut_cambiarResponsabilidad',
    friendlyName: 'Cambiar responsabilidades',
    parentAction: crearRut,
    canExecuteWithoutContext: false,
    schema: {
        Responsabilidad: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Number,
            message: 'Por favor ingrese el codigo de sus responsabilidades, calidades y atributos'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Ocupacion = parameters.Ocupacion;
        callback('Responsabilidad cambiada a' + parameters.Ocupacion);
    }
};


module.exports = [
	crearRut,
	crearRut_cambiarTI,
	crearRut_cambiarDi,
	crearRut_cambiarFechaExp,
	crearRut_cambiarPaisExp,
	crearRut_cambiarDptoExp,
	crearRut_cambiarMpioExp,
	crearRut_cambiarApellido1,
	crearRut_cambiarApellido2,
	crearRut_cambiarNombre1,
	crearRut_cambiarNombre2,
	crearRut_cambiarPaisUbi,
	crearRut_cambiarDptoUbi,
	crearRut_cambiarMpioUbi,
	crearRut_cambiarDireccion,
	crearRut_cambiarEmail,
	crearRut_cambiarPostal,
	crearRut_cambiarTelefono1,
	crearRut_cambiarTelefono2,
	crearRut_cambiarActPrinc,
	crearRut_cambiarActSecun,
	crearRut_cambiarOtrasAct,
	crearRut_cambiarOcupacion,
	crearRut_cambiarResponsabilidad
];


function formatDate(date) {
    var offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset).toDateString();
}