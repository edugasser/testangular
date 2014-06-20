from django.db import models
from .models import Libro, Autor
from .serializers import LibroSerializer, AutorSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.db import connection

#from rest_framework.pagination import PaginationSerializer
from django.template import RequestContext
from url_filter.backend import URLDjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework import serializers
from rest_framework.decorators import api_view
from test_rest.util import *
from django.core.paginator import Paginator
class LibroViewSet(viewsets.ModelViewSet):
	
    serializer_class = LibroSerializer
    queryset = Libro.objects.all()


from rest_framework.renderers import JSONRenderer

class EmberJSONRenderer(JSONRenderer):
	def render(self, data, accepted_media_type=None, renderer_context=None):
		print dir(serializers.Field(source='convert_to_epoc'))

		return super(EmberJSONRenderer, self).render(data, accepted_media_type, renderer_context)


class AutorViewSet(viewsets.ModelViewSet):
	'''serializer_class = AutorSerializer
	model = Autor
	def get_queryset(self):
		"""
		This view should return a list of all the purchases for
		the user as determined by the username portion of the URL.
		"""
		par=self.request.QUERY_PARAMS
		for key in par:
			print key,par[key]
		queryset = Autor.objects.all()

		return queryset
	'''
	serializer_class = AutorSerializer
	queryset = Autor.objects.all()
	filter_backends = (URLDjangoFilterBackend,OrderingFilter)
	filter_fields = ('nombre','apellido')
	renderer_classes = (EmberJSONRenderer, )
	ordering_fields = '__all__'

STATIC='static/scripts/controllers/'
items_per_page=5
@api_view(['GET'])
def autor_list(request):
	"""
	List all snippets, or create a new snippet.
	"""
	if request.method == 'GET':
		kwargs = {}
		querys=request.GET
		for campo in querys.keys():
			print campo,querys[campo]
			if campo in ['ordering','page']:continue
			kwargs['{0}__{1}'.format(campo, 'icontains')] = querys[campo]

		orden=request.GET.get("ordering")
		if not orden:
			orden='id'
		sensitive={'%s' % orden:'lower(%s)' % orden}
		objects=Autor.objects.filter(**kwargs).extra(select=sensitive).order_by(orden)

		p = Paginator(objects, items_per_page)

		npage=request.GET.get("page")
		print npage
		if not npage:
			npage=1

		page = p.page(npage)
		objects=list(page.object_list)

		serializer = AutorSerializer(objects)
		fields=Autor._meta.fields

		ls_fields=[]
		for field in fields:
			if isinstance(field, models.AutoField):
				ls_fields.append({'field':field.name,'displayName':field.name.title(),
					'cellTemplate':STATIC+'imageTemplate.html','headerCellTemplate':STATIC+'filterHeaderTemplate.html'})
			else:
				ls_fields.append({'field':field.name,'displayName':field.name.title(),'headerCellTemplate':STATIC+'filterHeaderTemplate.html'})

		data={}
		data['results']=serializer.data
		data['count']=len(serializer.data)
		data['headers']=ls_fields
		data['num_pages']=p.num_pages
		return Response(data)



'''
# FUNCIONA EN GRID.JS
class AutorViewSet(viewsets.ModelViewSet):
	serializer_class = AutorSerializer
	model = Autor
	def get_queryset(self):
		"""
		This view should return a list of all the purchases for
		the user as determined by the username portion of the URL.
		"""
		par=self.request.QUERY_PARAMS
		print par
		queryset = Autor.objects.all()

		return queryset
'''
'''
class AutorViewSet(viewsets.ModelViewSet):
	serializer_class = AutorSerializer
	model = Autor
	#queryset = Autor.objects.all()
	def get_queryset(self):
		pactual = self.request.QUERY_PARAMS.get('page', None)
		offset=(itemsPerPage*(int(pactual)-1))
		print pactual,offset
		cursor = connection.cursor()
		cursor.execute((SELECT *
			FROM apprest_autor		
			LIMIT %s OFFSET %s) % (itemsPerPage,offset))
		grid=dictfetchall(cursor)
		print grid

		return grid

	def get_queryset(self):
		page = self.request.QUERY_PARAMS.get('page', None)
		serializer = PaginationSerializer(instance=page)
		serializer.data'''