from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from settings import BASE_DIR,STATIC_URL

from django.contrib import admin
admin.autodiscover()



from apprest.viewsets import LibroViewSet, AutorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(r'libros', LibroViewSet)
router.register(r'autores', AutorViewSet)




urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'test_rest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^home$', TemplateView.as_view(template_name="base.html")),
    url(r'^grid$', TemplateView.as_view(template_name="grid.html")),
    url(r'^grids$', TemplateView.as_view(template_name="grids.html")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^static/(?P<path>.*)$','django.views.static.serve',
	{'document_root':STATIC_URL,}),
	
)
