import json
import time

from django.http import JsonResponse
from django.views import View
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
import json
import manage
# Create your views here.
class HomeView(View):
    template_name = 'home.html'
    def fetch_object_data(self):
        return None

    def get(self, request):
        answer = manage.APP_DATA.data.get("answer")
        return render(request, self.template_name,answer)

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            manage.APP_DATA.data["offer"] = data.get('offer',None)
            offer = data.get('offer')
            if offer is not None:
                print(offer)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error'},{'message': 'invalid'})
        except json.JSONDecodeError as e:
            print(f'Error decoding JSON:{e}')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'})


class ChatView(View):
    template_name = 'chat.html'

    def get(self, request):
        offer = manage.APP_DATA.data.get("offer")
        return render(request, self.template_name,context={'offer': offer})

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            manage.APP_DATA.data["answer"] = data.get('answer', None)
            answer = data.get('answer')
            if answer is not None:
                print(answer)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error'}, {'message': 'invalid'})
        except json.JSONDecodeError as e:
            print(f'Error decoding JSON:{e}')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'})
