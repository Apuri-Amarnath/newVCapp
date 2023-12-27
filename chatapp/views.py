import json
import time
import uuid
import socket

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
import json

from django.views.decorators.csrf import csrf_exempt

import manage

from django.views.generic import ListView

from chatapp.models import MeetingModel


def get_local_ip():
    try:
        # Get the hostname of the local machine
        hostname = socket.gethostname()

        # Get the IP address of the local machine
        ip_address = socket.gethostbyname(hostname)

        return ip_address
    except Exception as e:
        print(f"Error getting local IP address: {e}")
        return None


local_ip = get_local_ip()


def populate_remote_ip(request, rtcSessionData):
    remoteAddress = request.META.get('REMOTE_ADDR', None)
    if remoteAddress == "127.0.0.1":  # incase the browser is running on same host as the sever
        remoteAddress = local_ip
    # not doing anything right now
    # rtcSessionData["sdp"] = rtcSessionData.get("sdp").replace("0.0.0.0", remoteAddress)


# Create your views here.
class HomeView(View):
    template_name = 'home.html'

    def fetch_object_data(self):
        return None

    def get(self, request):
        answer = manage.APP_DATA.data.get("answer")
        return render(request, self.template_name, answer)

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            manage.APP_DATA.data["offer"] = data.get('offer', None)
            offer = data.get('offer')
            if offer is not None:
                print(offer)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error', 'message': 'invalid'})
        except json.JSONDecodeError as e:
            print(f'Error decoding JSON:{e}')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'})


class ChatView(View):
    template_name = 'chat.html'

    def get(self, request):
        offer = manage.APP_DATA.data.get("offer")
        return render(request, self.template_name, context={'offer': offer})

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


@method_decorator(csrf_exempt, name='dispatch')
class CreateMeeting(View):
    template_name = 'meeting-creator.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            if data is None:
                return JsonResponse({'status': 'error', 'message': 'invalid'})

            meetingId = data.get('meetingId', None)
            if meetingId is None:
                meetingId = str(uuid.uuid4())
            if "createNewMeeting" == data.get("requestType"):
                populate_remote_ip(request, data.get('offerData'))
                meetingObj = MeetingModel(meetingId, data.get("userId"), data.get("meetingTitle"),
                                          data.get('offerData'))
                manage.APP_DATA.data[meetingObj.meetingId] = meetingObj
                return JsonResponse({'status': 'success', 'meetingId': meetingObj.meetingId})
            elif "getClientAnswer" == data.get("requestType"):
                print(f"meetingId: {meetingId} is waiting for answer!")
                meetingObj = manage.APP_DATA.data.get(meetingId)
                if meetingObj is not None and len(meetingObj.answers) > 0:
                    answerData = meetingObj.answers.get("singleClientForNow")
                    return JsonResponse(
                        {'status': 'success', 'answerData': answerData, 'meetingId': meetingObj.meetingId,
                         "meetingTitle": meetingObj.meetingTitle})
            return JsonResponse({'status': 'error', 'message': 'invalid'})
        except json.JSONDecodeError as e:
            print(f'Error decoding JSON:{e}')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'})


@method_decorator(csrf_exempt, name='dispatch')
class JoinMeeting(View):
    template_name = 'join-meeting.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            if data is None:
                return JsonResponse({'status': 'error', 'message': 'invalid'})

            requestType = data.get('requestType', None)
            meetingId = data.get('meetingId', None)
            if requestType is None or meetingId is None:
                return JsonResponse({'status': 'error', 'message': 'invalid'})
            if requestType == 'giveMeOffer':
                meetingObj = manage.APP_DATA.data.get(meetingId)
                if meetingObj is None:
                    return JsonResponse({'status': 'error', 'message': 'invalid'})
                return JsonResponse(
                    {'status': 'success', 'meetingId': meetingObj.meetingId, "offer": meetingObj.offerData})
            elif requestType == 'takeMyAnswer':
                meetingObj = manage.APP_DATA.data.get(meetingId)
                populate_remote_ip(request, data.get('answerData'))
                meetingObj.answers["singleClientForNow"] = data.get("answerData")
                # meetingObj.answers[data.get("username")] = data.get("answerData")
                if meetingObj is None:
                    return JsonResponse({'status': 'error', 'message': 'invalid'})
                return JsonResponse(
                    {'status': 'success', 'meetingId': meetingObj.meetingId, "meetingTitle": meetingObj.meetingTitle})
            else:
                return JsonResponse({'status': 'error', 'message': 'invalid'})
        except json.JSONDecodeError as e:
            print(f'Error decoding JSON:{e}')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'})
