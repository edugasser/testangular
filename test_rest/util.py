# -*- coding: utf-8 -*-
def field_to_column(field,hidden=[],rename=''):
    dc={}
    final=[]
    # en caso de unicode (json)
    try:
        if field.name in hidden:
            dc['hidden']=True
    except:
        pass

    if isinstance(field, models.AutoField):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['hidden']=True
        dc['editable']=False
    elif isinstance(field, models.ImageField):
        dc['header']=' '
        dc['dataIndex']='foto'
        dc['width']=60
        dc['sortable']=False
        dc['filter']='foto' 
        #?function(value){return \"<img width=\'30\' src=\'/static/fotos/\'+value+\'.png\' />\";}"   
        dc['renderer']="?ponfoto" 
        #dc['renderer']="function(value){return \"<img width=\'30\' src=\'/static/fotos/\'+value+\'.png\' />\";}"
    elif isinstance(field, models.CharField):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['type'] = 'string'
        dc['editor']='textfield'
        dc['sortable']=True
        dc['filter']=True 
    elif isinstance(field, models.IntegerField):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['type'] = 'int'
        dc['editor']='numberfield'
        dc['sortable']=True
        dc['filter']=True 
    elif isinstance(field,models.EmailField):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['type'] = 'string'
        dc['editor']='textfield'
        dc['sortable']=True
        dc['filter']=True 
    elif isinstance(field, models.DateField):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['xtype'] = 'datecolumn'
        dc['editor']='datefield'
        dc['format'] = 'Y-m-d'
        dc['sortable']=True
        dc['filter']=True 
    elif isinstance(field,JSONField):
        # lo tratamos abajo
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['type'] = 'string'
        dc['editor']='textfield'
        dc['sortable']=True
        dc['filter']=True 
    elif field.__class__.__name__=='unicode':
        # para campos añadidos que son tipo json
        listener={}
        listener["checkChange"]="?miFuncion"
        dc['flex']= 1
        dc['dataIndex']=field.lower()
        dc['header']=field.title()
        dc['sortable']=True
        dc['xtype']='checkcolumn'
        dc['editor']='checkbox'
        dc['type']= 'bool'
        dc['listeners']=listener
        dc['filter']='bool' 
    elif isinstance(field,models.BooleanField):
        '''dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['xtype']='checkcolumn'
        dc['type']= 'boolean'
        dc['sortable']=True'''
        # para campos añadidos que son tipo json
        listener={}
        listener["checkChange"]="?miFuncion"
        dc['flex']= 1
        dc['dataIndex']=field.name.lower()
        dc['header']=field.verbose_name.title()
        dc['sortable']=True
        dc['xtype']='checkcolumn'
        dc['editor']='checkbox'
        dc['type']= 'bool'
        dc['listeners']=listener        
    elif isinstance(field,models.ForeignKey):
        dc['header']=field.verbose_name.title()
        dc['dataIndex']=field.name.lower()
        dc['flex']= 1
        dc['hidden']=True
        dc['header']=field.name
        # si el campo no está oculto, mostramos el verbose de ese foreign key
        # ejemplo: id_persona -> mostramos persona.
        if field.name not in hidden:
            verbose=field.verbose_name
            if rename<>'':verbose=rename
            display_value={}
            display_value['flex']= 1
            display_value['header']=verbose.title()
            display_value['dataIndex']=verbose.lower()
            display_value['type'] = 'string'
            display_value['filter']='list' 

            # si el modelo es persona, ponemos su foto
            if field.rel.to==Persona:
                display_value['filter']=True 
                dc_foto={}  
                dc_foto['header']=' '
                dc_foto['dataIndex']='foto'
                dc_foto['width']=60
                dc_foto['sortable']=False
                dc_foto['filter']='foto' 
                #?function(value){return \"<img width=\'30\' src=\'/static/fotos/\'+value+\'.png\' />\";}"   
                dc_foto['renderer']="?ponfoto" 
                final.append(dc_foto)       
            final.append(display_value) # inserto la columna despues de la foto
            
    final.append(dc)
    return final
