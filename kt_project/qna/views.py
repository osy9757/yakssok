from django.shortcuts import render
from .models import qna
from django.shortcuts import render
from .models import qna
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from .serializers import QnaSerializer, Qna_A_Serializer
from rest_framework.exceptions import ValidationError
from os.path import splitext

def qna_home(request):
    qna_posts = qna.objects.all()
    return render(request, 'qna/qna_post.html', {'qna_posts': qna_posts})

# def qna_update(request):
#     if request.method == 'POST':
#         user_info = request.POST.get('user_info')
#         question = request.POST.get('question')
#         photo = request.FILES.get('photo')

#         new_question = qna(user_info=user_info, 질문=question, user_img=photo)
#         new_question.save()

#     return render(request, 'qna/qna_update.html')

@api_view(['GET'])
def qna_list(request):
    qna_posts = qna.objects.all()
    data = [{'no': post.no, 'user_info': post.user_info, 'question': post.question, 'answer': post.answer, 'user_img': str(post.user_img.url) if post.user_img else None} for post in qna_posts]

    for item in data:
        if item['user_img']:
            item['user_img'] = item['user_img']

    return Response(data)


#보안코드 적용
from rest_framework import status
from rest_framework.response import Response

 

class QnaCreate(generics.CreateAPIView):
    queryset = qna.objects.all()
    serializer_class = QnaSerializer

    def create(self, request, *args, **kwargs):
        user_info = request.data.get('user_info')
        question = request.data.get('question')
        user_img = request.FILES.get('user_img')

        # 등록 로직 수행
        try:
            new_qna = qna.objects.create(user_info=user_info, question=question, user_img=user_img)
            new_qna.save()
            print('등록 성공!!')
            return Response({'message': '등록 성공!!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('등록 실패:', str(e))
            return Response({'message': '등록 실패!!'}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        user_info = request.query_params.get('user_info')
        question = request.query_params.get('question')
        user_img = request.query_params.get('user_img')

        print('GET 요청 정보:', user_info, question, user_img)

        return Response({'message': 'GET 요청을 처리하였습니다.'}, status=status.HTTP_200_OK)


    # # 화이트리스트 확장자
    # WHITE_LIST_EXT = [
    #     '.jpg',
    #     '.jpeg'
    # ]

    # # 파일 제한 사이즈 (1MB)
    # FILE_SIZE_LIMIT = 1024 * 1024

    # @api_view(['POST'])
    # def qna_post(self, request, format=None):
    #     user_info = request.data.get('user_info')
    #     question = request.data.get('question')
    #     photo = request.FILES.get('photo')

    #     # 이미지 사이즈 검사
    #     if photo:
    #         if photo.size > self.FILE_SIZE_LIMIT:
    #             return ValidationError("이미지 크기가 제한을 초과했습니다.")

    #         # 확장자 검사
    #         ext = splitext(photo.content_type)[1].lower()
    #         print(ext)
    #         if ext not in self.WHITE_LIST_EXT:
    #             return ValidationError("허용되지 않는 파일 확장자입니다.")

    #         new_question = qna.objects.create(user_info=user_info, 질문=question, user_img=photo)
    #         return Response({'message': '질문이 성공적으로 생성되었습니다.'}, status=status.HTTP_201_CREATED)

#답변 업로드 화면
from rest_framework.decorators import api_view

class QnaUpdate(generics.UpdateAPIView):
    queryset = qna.objects.all()
    serializer_class = Qna_A_Serializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({'message': '답변이 성공적으로 업데이트되었습니다.'}, status=status.HTTP_200_OK)
    

@api_view(['GET'])
def qna_detail(request):
    qna_posts = qna.objects.filter(no=22)

    if qna_posts.exists():
        data = []
        for qna_post in qna_posts:
            user_img = None
            if qna_post.user_img:
                user_img = qna_post.user_img.url

            data.append({
                'no': qna_post.no,
                'user_info': qna_post.user_info,
                'question': qna_post.question,
                'answer': qna_post.answer,
                'user_img': user_img
            })
        return Response(data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def qna_update(request, no):
    try:
        qna_post = qna.objects.get(no=no)
    except qna.DoesNotExist:
        return Response(status=404)

    qna_post.user_info = request.data.get('user_info', qna_post.user_info)
    qna_post.question = request.data.get('question', qna_post.question)
    qna_post.answer = request.data.get('answer', qna_post.answer)
    qna_post.user_img = request.FILES.get('photo', qna_post.user_img)
    qna_post.save()
    return Response({'message': '질문과 답변이 성공적으로 업데이트되었습니다.'})

@api_view(['DELETE'])
def qna_delete(request, pk):
    try:
        qna_post = qna.objects.get(pk=pk)
    except qna.DoesNotExist:
        return Response(status=404)

    qna_post.delete()
    return Response(status=204)

#답변 업로드 화면
@api_view(['PUT'])
def qna_answer_update(request, no):
    try:
        qna_post = qna.objects.get(no=20)
    except qna.DoesNotExist:
        return Response(status=404)

    qna_post.answer = request.data.get('answer', qna_post.answer)
    qna_post.save()
    
    return Response({'message': '답변이 성공적으로 업데이트되었습니다.'})