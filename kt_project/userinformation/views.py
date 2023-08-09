from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AccountInfo
from .serializers import LoginSerializer
from . import models
from .serializers import AccountInfoSerializer
from .models import CustomUserManager

# Create your views here.
class ChatAPIView(generics.GenericAPIView, mixins.CreateModelMixin):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer

    def get(self, request):
        queryset = models.AccountInfo.objects.all()
        serializer = self.get_serializer(queryset, many = True)

        return self.success_response(serializer.data)

    def not_found_response(self):
            return self.error_response("Account not found", status=404)

    def success_response(self, data, status=200):
        return self.response(data, status=status)

    def error_response(self, message, status=400):
        return self.response({"message": message}, status=status)

    def response(self, data, status):
        return Response(data, status=status)
# class ChatAPIView(generics.GenericAPIView, mixins.CreateModelMixin):
#     queryset = models.AccountInfo.objects.all()
#     serializer_class = AccountInfoSerializer
#     # login_user = 'admin1234'

#     def get(self, request, account_id=None):
#         if account_id:
#             try:
#                 account = models.AccountInfo.objects.get(user_id=account_id)
#             except models.AccountInfo.DoesNotExist:
#                 return self.not_found_response()

#             # login_user = account_id
#             serializer = self.get_serializer(instance = account)

#             return self.success_response(serializer.data)
#         else:
#             try:
#                 account_ids = [account.user_id for account in models.AccountInfo.objects.all()]
#             except models.AccountInfo.DoesNotExist:
#                 return self.not_found_response()

#             # login_user = request.user.user_id 
#             # account_ids = [account_id for account_id in account_ids if account_id != login_user]


#             return self.success_response(account_ids)

    def not_found_response(self):
        return self.error_response("Account not found", status=404)

    def success_response(self, data, status=200):
        return self.response(data, status=status)

    def error_response(self, message, status=400):
        return self.response({"message": message}, status=status)

    def response(self, data, status):
        return Response(data, status=status)

# Account 생성     
class AccountInfoList(ListCreateAPIView):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer
    
    def perform_create(self, serializer):
        password = serializer.validated_data['pw']
        hashed_password = make_password(password)
        serializer.save(pw=hashed_password)

# Account 상세보기, 수정, 삭제
class DetailInfo(RetrieveUpdateDestroyAPIView):
    queryset = models.AccountInfo.objects.all()
    serializer_class = AccountInfoSerializer

# Account 로그인
class LoginView(generics.GenericAPIView, mixins.CreateModelMixin):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request=request, username=username, password=password)
        
        if user is not None:
            self.login(request, user)
            token = self.generate_jwt_token(user)
            return self.get_response(token,user)
        else:
            return Response({'message': '로그인 실패.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def login(self, request, user):
        # 세션에 사용자 정보를 저장
        request.session['user'] = user.user_id

    def generate_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return token

    def get_response(self, token, user):
            # 로그인 성공 후 응답 데이터를 구성하고 토큰을 포함시킵니다.
            
            account = models.AccountInfo.objects.get(user_id=user.user_id)
            # serialized_account = AccountInfoSerializer.seialize('json',[account])
            # serializer = self.get_serializer(data=account)
            # serializer.is_valid(raise_exception=True)
            
            serializer = AccountInfoSerializer(account)
            serialized_data = serializer.data
            
            response_data = {
                'message': '로그인되었습니다.',
                'data' : serialized_data,
            }
            response = Response(response_data)

            # JWT 토큰을 Authorization 헤더에 추가합니다.
            jwt_token = token['access']
            response['Authorization'] = 'Bearer ' + jwt_token

            return response


#region UserInfo 수정, 삭제 함수
# def login(req):

#     if req.method == 'POST':
#         user_id = req.POST.get('id')
#         pw = req.POST.get('pw')

#         me = models.user_info.objects.get(id = user_id)

#         if me.pw == pw:
#             req.session['user'] = me.name
#             return redirect('/user')

#         elif me.pw != pw:
#             return HttpResponse('로그인 실패')


#     return render(req, 'userinformation/login.html')
#endregion

#region UserInfo 상세보기, 수정, 삭제 함수    
# def join(request):
#     if request.method == 'POST':
#         name = request.POST.get('name')
#         email = request.POST.get('email')
#         admin = request.POST.get('admin')
#         disease = request.POST.get('disease')
#         phone = request.POST.get('phone')
#         id = request.POST.get('id')
#         pw = request.POST.get('pw')
        
#         # 새로운 사용자 생성
#         new_user = models.user_info.objects.create(
#             id=id, disease=disease, admin=admin, pw=pw, email=email, name=name, phone=phone
#         )
        
#         # 회원가입 완료 후 리다이렉트할 URL
#         redirect_url = '/'
        
#         return redirect(redirect_url)
    
#     return render(request, 'userinformation/join.html')
# def detail_info(req, id):
#     post = models.user_info.objects.get(id=id)

#     return render(req,'userinformation/detail_info.html', {"post":post})
#endregion

#region UserInfo 리스트 함수
# def user_info(req):

#     info = models.user_info.objects.all()

#     return render(req, 'userinformation/user_index.html', {'info' : info})
#endregion