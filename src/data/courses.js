// "추천 코스" 데이터. audio-test/theme_course.md 를 옮긴 것 (이동 시간은 대략적인 예상치).
// 좌표는 저장해 둔 비짓제주, TourAPI 데이터에서 이름으로 맞췄다. 좌표가 없는 지점은 핀 없이 순서에만 나온다.
//
// 글자는 { ko, en, ja, 'zh-CN', 'zh-TW' }, 없는 언어는 ko 를 보여줌 (지금은 ko 만 있음).
// photo: 비짓제주, TourAPI 사진 주소 또는 비짓제주에서 내려받아 넣은 사진(public/course-photos/). 화면에 출처를 표시한다.
// 토산포구 좌표는 주소(표선면 토산리 30-3)를 카카오 주소 검색으로 한 번 바꾼 값.
// description 과 stop.note 는 지금 화면에 보여주지 않는다.
// stop: { name, note, move: { mode: 'car' | 'walk' | 'ferry', minutes }, time, stay: 분, withDrive, lat, lng }
// course: { id, filters, name, summary, description, minutes(전체 분), trail: { km, hours, level }, tip, stops }
export const courses = [
  {
    "id": "day-1",
    "filters": [
      "day"
    ],
    "name": {
      "ko": "성산에서 표선까지 동쪽 바다"
    },
    "summary": {
      "ko": "광치기해변 / 성산일출봉 / 가시아방국수"
    },
    "description": {
      "ko": "성산일출봉과 섭지코지를 보고 표선 쪽으로 내려가는 10:00~18:00 약 8시간 코스. 점심과 저녁을 각각 한 번씩 넣었다."
    },
    "minutes": 480,
    "stops": [
      {
        "name": {
          "ko": "광치기해변"
        },
        "note": {
          "ko": "성산일출봉이 바다 건너로 보이는 해안에서 하루를 시작한다."
        },
        "time": "10:00~10:40",
        "stay": 40,
        "lat": 33.45245,
        "lng": 126.92458,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/d5b7e9a3-8cfb-41cf-9623-9b15651d4c55.webp"
      },
      {
        "name": {
          "ko": "성산일출봉"
        },
        "note": {
          "ko": "올라가며 동쪽 바다와 마을을 내려다본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "10:50~12:10",
        "stay": 80,
        "lat": 33.46215,
        "lng": 126.93642,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/20/464d6099-295a-4e60-bd93-9e65388f4d0d.webp"
      },
      {
        "name": {
          "ko": "가시아방국수"
        },
        "note": {
          "ko": "고기국수와 돔베고기로 점심을 먹는다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "12:20~13:20",
        "stay": 60,
        "lat": 33.42421,
        "lng": 126.93111,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/ddc8e75e-c2c6-482e-b3eb-3c0468973a88.webp"
      },
      {
        "name": {
          "ko": "섭지코지"
        },
        "note": {
          "ko": "해안 산책길에서 오름과 바다를 함께 바라본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "13:30~14:50",
        "stay": 80,
        "lat": 33.42369,
        "lng": 126.9296,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/16/f18ca648-b42f-4209-b87a-2410b8da656d.webp"
      },
      {
        "name": {
          "ko": "아줄레주"
        },
        "note": {
          "ko": "에그타르트로 알려진 유럽풍 카페에서 쉰다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "time": "15:05~15:55",
        "stay": 50,
        "lat": 33.36682,
        "lng": 126.83914,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/17/29d0b439-46d6-46e0-ac82-120b661b3c3a.webp"
      },
      {
        "name": {
          "ko": "표선해수욕장"
        },
        "note": {
          "ko": "넓은 모래사장과 바다를 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 20
        },
        "time": "16:15~17:00",
        "stay": 45,
        "lat": 33.32723,
        "lng": 126.8381,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/29/75201e85-e5f0-498a-986a-043dac98d1fb.webp"
      },
      {
        "name": {
          "ko": "나목도식당"
        },
        "note": {
          "ko": "가시리의 고기 요리로 저녁을 먹고 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "17:10~18:00",
        "stay": 50,
        "lat": 33.35353,
        "lng": 126.77182,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201807/03/c2e2b1dd-a2b1-4424-b93a-f116a191c14a.webp"
      }
    ]
  },
  {
    "id": "day-2",
    "filters": [
      "day"
    ],
    "name": {
      "ko": "협재에서 신창까지 서쪽 물빛"
    },
    "summary": {
      "ko": "금능해수욕장 / 협재해수욕장 / 명랑스낵"
    },
    "description": {
      "ko": "협재, 금능의 바다와 신창 풍차를 묶은 10:00~18:00 약 8시간 일정. 점심은 해변 근처, 저녁은 한경 쪽에서 먹는다."
    },
    "minutes": 480,
    "stops": [
      {
        "name": {
          "ko": "금능해수욕장"
        },
        "note": {
          "ko": "맑은 물빛과 비양도 풍경을 감상한다."
        },
        "time": "10:00~10:40",
        "stay": 40,
        "lat": 33.39,
        "lng": 126.23591,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/25/120296bb-0959-4579-ad37-c559e95b434c.webp"
      },
      {
        "name": {
          "ko": "협재해수욕장"
        },
        "note": {
          "ko": "금능과 이어지는 해변을 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "10:50~11:45",
        "stay": 55,
        "lat": 33.39248,
        "lng": 126.23899,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/27/6b6dc9c4-5466-493e-98e5-580dbf18eefc.webp"
      },
      {
        "name": {
          "ko": "명랑스낵"
        },
        "note": {
          "ko": "바다와 비양도가 보이는 자리에서 떡볶이와 튀김으로 점심."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "11:55~12:55",
        "stay": 60,
        "lat": 33.40928,
        "lng": 126.25884,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202203/11/daa7e2fc-971e-43b8-865a-1fe943d1aad4.webp"
      },
      {
        "name": {
          "ko": "한림공원"
        },
        "note": {
          "ko": "정원과 산책길을 여유 있게 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "13:05~14:35",
        "stay": 90,
        "lat": 33.38799,
        "lng": 126.23978,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202205/30/58ce2ef7-c996-462e-aa99-eb613c01e95a.webp"
      },
      {
        "name": {
          "ko": "이익새양과점"
        },
        "note": {
          "ko": "밀크티와 파운드케이크로 쉬어 간다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "14:45~15:30",
        "stay": 45,
        "lat": 33.40706,
        "lng": 126.26557,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201903/25/37f2db4e-ea74-4c84-8146-f63471ae242d.webp"
      },
      {
        "name": {
          "ko": "신창풍차해안"
        },
        "note": {
          "ko": "풍차와 바다가 이어진 해안에서 사진을 남긴다."
        },
        "move": {
          "mode": "car",
          "minutes": 25
        },
        "time": "15:55~16:50",
        "stay": 55,
        "lat": 33.34303,
        "lng": 126.17217,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/22/94f00b31-8791-404f-9b32-981969fa9204.webp"
      },
      {
        "name": {
          "ko": "연리지 가든"
        },
        "note": {
          "ko": "농장에서 키운 재래 흑돼지로 저녁을 먹는다. 방문 전 예약과 휴무를 확인한다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "17:00~18:00",
        "stay": 60,
        "lat": 33.33613,
        "lng": 126.19893,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202002/20/4bcc00d5-6bc5-4745-b461-0c25f7011f80.webp"
      }
    ]
  },
  {
    "id": "day-3",
    "filters": [
      "day"
    ],
    "name": {
      "ko": "쇠소깍에서 서귀포 원도심까지"
    },
    "summary": {
      "ko": "쇠소깍 / 보목포구 / 어진이네 횟집"
    },
    "description": {
      "ko": "서귀포의 물길과 포구, 골목을 잇는 10:00~18:00 약 8시간 코스. 해산물 점심과 갈치 요리 저녁을 포함한다."
    },
    "minutes": 480,
    "stops": [
      {
        "name": {
          "ko": "쇠소깍"
        },
        "note": {
          "ko": "하천과 바다가 만나는 풍경을 둘러본다."
        },
        "time": "10:00~10:55",
        "stay": 55,
        "lat": 33.25409,
        "lng": 126.6223,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/16/54503744-a4b3-4e68-b819-47e67df59100.webp"
      },
      {
        "name": {
          "ko": "보목포구"
        },
        "note": {
          "ko": "섶섬이 보이는 작은 포구에서 잠시 쉰다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "time": "11:10~11:50",
        "stay": 40,
        "lat": 33.23927,
        "lng": 126.60689,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201907/17/3dfdaafa-6623-4a49-915e-a7e4f7c659fe.webp"
      },
      {
        "name": {
          "ko": "어진이네 횟집"
        },
        "note": {
          "ko": "보목의 물회나 생선구이로 점심을 먹는다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "11:55~12:55",
        "stay": 60,
        "lat": 33.2409,
        "lng": 126.61069,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202301/27/bfba8cc8-895e-4882-830d-b22735a6cab3.webp"
      },
      {
        "name": {
          "ko": "정방폭포"
        },
        "note": {
          "ko": "바다 가까이 떨어지는 폭포를 감상한다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "13:05~14:00",
        "stay": 55,
        "lat": 33.24485,
        "lng": 126.5718,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/25/1607868f-80ba-4f86-94cd-77a8c7d52cd6.webp"
      },
      {
        "name": {
          "ko": "이중섭거리"
        },
        "note": {
          "ko": "서귀포 원도심의 골목을 구경한다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "14:05~14:55",
        "stay": 50,
        "lat": 33.24555,
        "lng": 126.56441,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/24/d335b597-8858-4fcb-8ba9-c4792127f4fb.webp"
      },
      {
        "name": {
          "ko": "유동커피"
        },
        "note": {
          "ko": "취향에 맞는 커피를 골라 쉬어 간다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "15:00~15:50",
        "stay": 50,
        "lat": 33.24449,
        "lng": 126.5639,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/3a3cd1f1-b513-4535-be87-eadca0bcbe16.webp"
      },
      {
        "name": {
          "ko": "천지연폭포"
        },
        "note": {
          "ko": "숲길과 물소리를 따라 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "16:00~16:55",
        "stay": 55,
        "lat": 33.24472,
        "lng": 126.55982,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/c87fb80d-98e3-4911-ae75-787fee3f0f35.webp"
      },
      {
        "name": {
          "ko": "네거리식당"
        },
        "note": {
          "ko": "갈치국이나 갈치구이로 저녁을 먹고 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "17:05~18:00",
        "stay": 55,
        "lat": 33.24852,
        "lng": 126.55936,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201811/01/a361a387-cccf-40fa-9914-56840aa85fd7.webp"
      }
    ]
  },
  {
    "id": "day-4",
    "filters": [
      "day"
    ],
    "name": {
      "ko": "함덕에서 세화까지 북동쪽 해안"
    },
    "summary": {
      "ko": "함덕해수욕장 / 서우봉 산책길 / 곰막식당"
    },
    "description": {
      "ko": "함덕의 해변과 서우봉을 본 뒤 김녕, 월정리, 세화로 이어지는 10:00~18:00 약 8시간 일정. 중간에 점심과 저녁이 있다."
    },
    "minutes": 480,
    "stops": [
      {
        "name": {
          "ko": "함덕해수욕장"
        },
        "note": {
          "ko": "넓은 해변과 맑은 바다를 바라본다."
        },
        "time": "10:00~10:45",
        "stay": 45,
        "lat": 33.54273,
        "lng": 126.66909,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/20/3d61ccf2-3fa8-422a-bc40-8cbafe20c52d.webp"
      },
      {
        "name": {
          "ko": "서우봉 산책길"
        },
        "note": {
          "ko": "함덕의 바다를 위에서 내려다보며 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "10:50~11:50",
        "stay": 60,
        "lat": 33.53441,
        "lng": 126.63425,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201807/09/44e6831f-d009-48bd-9ace-34375b775c44.webp"
      },
      {
        "name": {
          "ko": "곰막식당"
        },
        "note": {
          "ko": "동복리에서 회국수나 성게국수로 점심을 먹는다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "time": "12:05~13:05",
        "stay": 60,
        "lat": 33.55697,
        "lng": 126.72074,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/05/987bb57c-15ac-412a-b821-e248598f0db7.webp"
      },
      {
        "name": {
          "ko": "김녕미로공원"
        },
        "note": {
          "ko": "미로를 찾아 걸으며 잠시 바다와 다른 풍경을 즐긴다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "time": "13:20~14:30",
        "stay": 70,
        "lat": 33.53658,
        "lng": 126.7724,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/09/a56a5a58-59e0-4da0-8d4a-6f18d0043d93.webp"
      },
      {
        "name": {
          "ko": "월정리해변"
        },
        "note": {
          "ko": "해변의 푸른 물빛과 마을 풍경을 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "14:40~15:35",
        "stay": 55,
        "lat": 33.55505,
        "lng": 126.79823,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/93/4075293_image3_1.jpg"
      },
      {
        "name": {
          "ko": "너는 파라다이스 길리"
        },
        "note": {
          "ko": "월정리 해변 분위기를 즐기며 음료를 마신다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "15:40~16:30",
        "stay": 50,
        "lat": 33.54681,
        "lng": 126.78381,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/15efc6db-2806-427c-813e-37fb8d78f492.webp"
      },
      {
        "name": {
          "ko": "세화해변"
        },
        "note": {
          "ko": "동쪽 바다를 보며 짧게 쉬어 간다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "time": "16:45~17:00",
        "stay": 15,
        "lat": 33.5253,
        "lng": 126.86128,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/24/26a940f4-8517-437c-bef2-88be65dfd157.webp"
      },
      {
        "name": {
          "ko": "연미정"
        },
        "note": {
          "ko": "전복 가마솥 밥으로 저녁을 먹고 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "17:05~18:00",
        "stay": 55,
        "lat": 33.52465,
        "lng": 126.85387,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/26/e39c3831-1025-48c9-b1f4-99659540953a.webp"
      }
    ]
  },
  {
    "id": "meal-1",
    "filters": [
      "meal"
    ],
    "name": {
      "ko": "산방산 보이는 한 끼"
    },
    "summary": {
      "ko": "남경미락 / 용머리해안 입구, 사계해안 / 원앤온리"
    },
    "description": {
      "ko": "산방산 주변에서 전망 좋은 식사와 카페를 고른 짧은 코스."
    },
    "stops": [
      {
        "name": {
          "ko": "남경미락"
        },
        "note": {
          "ko": "산방산과 바다를 보며 회를 먹을 수 있는 식당."
        },
        "stay": 80,
        "lat": 33.23022,
        "lng": 126.30895,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/12/2cee35af-0c35-4448-b32d-179bf66c2dd1.webp"
      },
      {
        "name": {
          "ko": "용머리해안 입구, 사계해안"
        },
        "note": {
          "ko": "해안 풍경을 바라보며 걷는다. 용머리해안 출입은 현장 통제를 따른다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 50,
        "lat": 33.23343,
        "lng": 126.31374,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202409/25/e7b66d4c-0ec8-48aa-b700-51d923282b9c.webp"
      },
      {
        "name": {
          "ko": "원앤온리"
        },
        "note": {
          "ko": "산과 바다를 함께 담는 카페에서 쉰다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 60,
        "lat": 33.23923,
        "lng": 126.31929,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/15/780ecdba-a31b-4d2e-873d-91ee1c717b11.webp"
      }
    ]
  },
  {
    "id": "meal-2",
    "filters": [
      "meal"
    ],
    "name": {
      "ko": "세화 바다와 전복밥"
    },
    "summary": {
      "ko": "연미정 / 세화해변 / 미엘드세화"
    },
    "description": {
      "ko": "세화 가까운 곳에서 식사를 마치고 해변을 걷는 코스."
    },
    "stops": [
      {
        "name": {
          "ko": "연미정"
        },
        "note": {
          "ko": "전복 가마솥 밥으로 한 끼를 먹는다."
        },
        "stay": 60,
        "lat": 33.52465,
        "lng": 126.85387,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/26/e39c3831-1025-48c9-b1f4-99659540953a.webp"
      },
      {
        "name": {
          "ko": "세화해변"
        },
        "note": {
          "ko": "푸른 물빛을 따라 천천히 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 45,
        "lat": 33.5253,
        "lng": 126.86128,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/24/26a940f4-8517-437c-bef2-88be65dfd157.webp"
      },
      {
        "name": {
          "ko": "미엘드세화"
        },
        "note": {
          "ko": "세화 바다 전망과 함께 디저트를 즐긴다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 60,
        "lat": 33.52448,
        "lng": 126.86187,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202203/11/309c8b07-e10f-4e45-903c-652fbb78deff.webp"
      }
    ]
  },
  {
    "id": "meal-3",
    "filters": [
      "meal"
    ],
    "name": {
      "ko": "애월 바다에서 쉬어가기"
    },
    "summary": {
      "ko": "성안식당 / 한담해안산책로 / 애월더선셋"
    },
    "description": {
      "ko": "점심 뒤 짧은 해안 산책을 하고 노을이 보이는 카페에서 머무는 코스."
    },
    "stops": [
      {
        "name": {
          "ko": "성안식당"
        },
        "note": {
          "ko": "전복뚝배기와 갈치국 등 제주 향토 음식으로 식사."
        },
        "stay": 60,
        "lat": 33.46484,
        "lng": 126.32011,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202506/09/3c1c26ca-9c64-4b4b-9e64-6fe3aa58565f.webp"
      },
      {
        "name": {
          "ko": "한담해안산책로"
        },
        "note": {
          "ko": "바다 곁의 길에서 40분가량 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 40,
        "lat": 33.45906,
        "lng": 126.3106,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/f1bd503b-f934-47b5-8e0c-63f282240843.webp"
      },
      {
        "name": {
          "ko": "애월더선셋"
        },
        "note": {
          "ko": "바다와 노을을 바라보는 오션뷰 카페."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 60,
        "lat": 33.456,
        "lng": 126.30891,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202201/10/77edc8dd-773e-400e-96b8-dfd56e0fd758.webp"
      }
    ]
  },
  {
    "id": "meal-4",
    "filters": [
      "meal"
    ],
    "name": {
      "ko": "중문 바다 한 바퀴"
    },
    "summary": {
      "ko": "중문해녀의집 / 대포항 주변 해안 / 바다다"
    },
    "description": {
      "ko": "자연산 해산물과 대포의 바다를 나란히 즐긴다."
    },
    "stops": [
      {
        "name": {
          "ko": "중문해녀의집"
        },
        "note": {
          "ko": "자연산 해산물 요리로 식사한다."
        },
        "stay": 60,
        "lat": 33.24265,
        "lng": 126.41892,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202112/07/458b8b95-8eaf-48fd-af18-ca10f6e35c6d.webp"
      },
      {
        "name": {
          "ko": "대포항 주변 해안"
        },
        "note": {
          "ko": "바다와 항구를 곁에 두고 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 40,
        "lat": 33.24352,
        "lng": 126.43522,
        "photo": "/course-photos/meal-daepo-port.jpg"
      },
      {
        "name": {
          "ko": "바다다"
        },
        "note": {
          "ko": "대포 바다를 가까이서 보며 음료를 마신다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 60,
        "lat": 33.2374,
        "lng": 126.43671,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/23/68fd740b-40c3-4bcc-a861-67700ecbc2b4.webp"
      }
    ]
  },
  {
    "id": "drive-1",
    "filters": [
      "drive"
    ],
    "name": {
      "ko": "애월 해안 따라 서쪽으로"
    },
    "summary": {
      "ko": "고내포구 / 애월 해안도로 전망 구간 / 한담해안산책로 입구"
    },
    "description": {
      "ko": "고내에서 곽지까지 해안도로를 따라가며 바다를 가까이서 보는 약 3시간 30분 코스. 차를 세울 때는 주차 가능한 곳을 이용한다."
    },
    "minutes": 210,
    "stops": [
      {
        "name": {
          "ko": "고내포구"
        },
        "note": {
          "ko": "해안도로의 시작에서 포구와 바다를 둘러본다."
        },
        "stay": 20,
        "lat": 33.46703,
        "lng": 126.3379,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/20/3589220_image3_1.jpg"
      },
      {
        "name": {
          "ko": "애월 해안도로 전망 구간"
        },
        "note": {
          "ko": "창밖으로 이어지는 바다와 현무암 해안을 즐긴다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 35,
        "withDrive": true,
        "lat": 33.47822,
        "lng": 126.36656,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/25/08f0e41c-8741-4820-9969-77261804192d.webp"
      },
      {
        "name": {
          "ko": "한담해안산책로 입구"
        },
        "note": {
          "ko": "길 전체를 걷기보다 바다 가까운 전망 구간만 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 25,
        "lat": 33.45906,
        "lng": 126.3106,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/f1bd503b-f934-47b5-8e0c-63f282240843.webp"
      },
      {
        "name": {
          "ko": "애월더선셋"
        },
        "note": {
          "ko": "바다 전망을 보며 음료 한 잔."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 50,
        "lat": 33.456,
        "lng": 126.30891,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202201/10/77edc8dd-773e-400e-96b8-dfd56e0fd758.webp"
      },
      {
        "name": {
          "ko": "곽지해수욕장"
        },
        "note": {
          "ko": "넓은 해변과 해안의 끝 풍경을 보고 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 35,
        "lat": 33.45122,
        "lng": 126.3058,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/25/51ef76f8-3171-4261-8423-a58df63d40aa.webp"
      }
    ]
  },
  {
    "id": "drive-2",
    "filters": [
      "drive"
    ],
    "name": {
      "ko": "김녕에서 세화까지 푸른 바다"
    },
    "summary": {
      "ko": "김녕해수욕장 / 월정리해변 / 너는 파라다이스 길리"
    },
    "description": {
      "ko": "북동쪽 해변을 차례로 연결하는 약 4시간 코스. 정차 장소에서는 각각 짧게 둘러본다."
    },
    "minutes": 240,
    "stops": [
      {
        "name": {
          "ko": "김녕해수욕장"
        },
        "note": {
          "ko": "하얀 모래와 푸른 물빛이 만나는 바다를 본다."
        },
        "stay": 35,
        "lat": 33.55702,
        "lng": 126.75988,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/15/fc931694-3362-4945-b566-be8d926476d7.webp"
      },
      {
        "name": {
          "ko": "월정리해변"
        },
        "note": {
          "ko": "해변 도로를 따라가며 동쪽 바다를 감상한다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "stay": 35,
        "lat": 33.55505,
        "lng": 126.79823,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/93/4075293_image3_1.jpg"
      },
      {
        "name": {
          "ko": "너는 파라다이스 길리"
        },
        "note": {
          "ko": "월정리 분위기를 느끼며 커피를 마신다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 50,
        "lat": 33.54681,
        "lng": 126.78381,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/15efc6db-2806-427c-813e-37fb8d78f492.webp"
      },
      {
        "name": {
          "ko": "세화해변"
        },
        "note": {
          "ko": "마을과 바다가 이어지는 해안을 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "stay": 35,
        "lat": 33.5253,
        "lng": 126.86128,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/24/26a940f4-8517-437c-bef2-88be65dfd157.webp"
      },
      {
        "name": {
          "ko": "하도해변"
        },
        "note": {
          "ko": "조금 더 한적한 동쪽 바다에서 여정을 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 35,
        "lat": 33.5183,
        "lng": 126.9017,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/23/1b0be13e-4828-4c77-a104-0116943f3cb3.webp"
      }
    ]
  },
  {
    "id": "drive-3",
    "filters": [
      "drive"
    ],
    "name": {
      "ko": "산방산에서 송악산까지"
    },
    "summary": {
      "ko": "산방산 주변 / 원앤온리 / 사계해안도로, 형제해안로"
    },
    "description": {
      "ko": "산방산 아래에서 형제섬이 보이는 사계해안도로를 지나 송악산으로 향하는 약 3시간 30분 코스."
    },
    "minutes": 210,
    "stops": [
      {
        "name": {
          "ko": "산방산 주변"
        },
        "note": {
          "ko": "산을 배경으로 남서쪽 풍경을 바라본다."
        },
        "stay": 25,
        "lat": 33.23661,
        "lng": 126.31289,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/16/5eedc065-a33e-4729-89c9-776c52af62c0.webp"
      },
      {
        "name": {
          "ko": "원앤온리"
        },
        "note": {
          "ko": "산방산과 바다를 함께 보는 카페에서 쉰다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 50,
        "lat": 33.23923,
        "lng": 126.31929,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/15/780ecdba-a31b-4d2e-873d-91ee1c717b11.webp"
      },
      {
        "name": {
          "ko": "사계해안도로, 형제해안로"
        },
        "note": {
          "ko": "형제섬이 보이는 해안을 따라 달린다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 40,
        "withDrive": true,
        "lat": 33.21973,
        "lng": 126.29425,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/15/465a7e6f-5d83-4ed2-9fc5-4eeaa7ca7857.webp"
      },
      {
        "name": {
          "ko": "송악산 둘레길 입구"
        },
        "note": {
          "ko": "가파도와 형제섬 쪽 전망을 짧게 감상한다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 35,
        "lat": 33.20771,
        "lng": 126.29099,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/19/d8c74606-b126-4b83-82ec-f088ca97b315.webp"
      },
      {
        "name": {
          "ko": "모슬포항"
        },
        "note": {
          "ko": "항구와 남서쪽 바다를 보며 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 25,
        "lat": 33.21892,
        "lng": 126.24864,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201908/06/8b36910c-5b9b-4d46-8794-91613b0f880c.webp"
      }
    ]
  },
  {
    "id": "drive-4",
    "filters": [
      "drive"
    ],
    "name": {
      "ko": "중산간 숲과 오름"
    },
    "summary": {
      "ko": "사려니숲길 붉은오름 입구 / 산굼부리 / 송당 마을길"
    },
    "description": {
      "ko": "해안 대신 숲길과 오름을 고른 약 4시간 15분 코스. 실제 도로의 정차 금지 구간에서는 멈추지 않는다."
    },
    "minutes": 255,
    "stops": [
      {
        "name": {
          "ko": "사려니숲길 붉은오름 입구"
        },
        "note": {
          "ko": "차를 세운 뒤 숲 입구에서 잠시 걸으며 시작한다."
        },
        "stay": 30,
        "lat": 33.39894,
        "lng": 126.67927,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/18/4072718_image3_1.jpg"
      },
      {
        "name": {
          "ko": "산굼부리"
        },
        "note": {
          "ko": "넓게 펼쳐진 분화구 주변 풍경을 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 20
        },
        "stay": 60,
        "lat": 33.43162,
        "lng": 126.69001,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/a7b4a973-40e9-44e6-87d9-46a4c4f3b367.webp"
      },
      {
        "name": {
          "ko": "송당 마을길"
        },
        "note": {
          "ko": "밭담과 중산간 마을을 차창에서 천천히 만난다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "stay": 25,
        "withDrive": true,
        "lat": 33.47106,
        "lng": 126.78093,
        "photo": "/course-photos/drive-songdang-path.jpg"
      },
      {
        "name": {
          "ko": "풍림다방 커피로스터즈 송당"
        },
        "note": {
          "ko": "옛 주택과 정원이 있는 카페에서 쉰다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 50,
        "lat": 33.47184,
        "lng": 126.78575,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202301/26/b5cd3aba-c78f-4204-b4a9-9766dec83eb4.webp"
      },
      {
        "name": {
          "ko": "비자림 입구"
        },
        "note": {
          "ko": "숲의 분위기를 느끼며 코스를 마친다. 깊이 걸으려면 별도 시간을 더 잡는다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "stay": 30,
        "lat": 33.49132,
        "lng": 126.81139,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/16/eda139ae-6a88-486f-b2df-f23ecca6326e.webp"
      }
    ]
  },
  {
    "id": "olle-1",
    "filters": [
      "olle"
    ],
    "name": {
      "ko": "성산으로 향하는 1코스"
    },
    "summary": {
      "ko": "시흥리 출발점 / 말미오름 구간 / 알오름, 종달리 방향 올레길"
    },
    "description": {
      "ko": "시흥에서 광치기까지 말미오름, 알오름과 동쪽 바다를 이어 걷는다. 오름에 오르면 성산일출봉과 우도, 시흥리 밭이 펼쳐진다."
    },
    "trail": {
      "km": "15.1km",
      "hours": "4~5",
      "level": "mid"
    },
    "tip": {
      "ko": "첫 오르막인 말미오름에서 숨이 찰 수 있다. 종달리 옛 소금밭~성산갑문 입구에는 별도로 안내된 휠체어 접근 구간 4.6km가 있다. 아래 구간별 활동 시간은 약 4시간 30분으로 잡고, 사진, 휴식을 포함하면 5~6시간 정도 확보한다. 원점으로 돌아와야 한다면 귀가 교통편도 따로 잡는다."
    },
    "stops": [
      {
        "name": {
          "ko": "시흥리 출발점"
        },
        "note": {
          "ko": "성산을 향해 걷기 시작하는 마을 길."
        },
        "stay": 30,
        "lat": 33.47724,
        "lng": 126.89598,
        "photo": "/course-photos/olle1-siheung-start.jpg"
      },
      {
        "name": {
          "ko": "말미오름 구간"
        },
        "note": {
          "ko": "바다와 밭, 우도를 내려다보며 첫 오르막을 오른다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 60,
        "lat": 33.47951,
        "lng": 126.88415,
        "photo": "/course-photos/olle1-malmi.jpg"
      },
      {
        "name": {
          "ko": "알오름, 종달리 방향 올레길"
        },
        "note": {
          "ko": "오름의 들판을 지나 마을과 해안으로 내려간다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 100,
        "lat": 33.48798,
        "lng": 126.88157,
        "photo": "/course-photos/olle1-aloreum.jpg"
      },
      {
        "name": {
          "ko": "성산 방향 해안길"
        },
        "note": {
          "ko": "성산일출봉이 가까워지는 구간."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 60,
        "lat": 33.46892,
        "lng": 126.92328,
        "photo": "/course-photos/olle1-seongsan-road.jpg"
      },
      {
        "name": {
          "ko": "광치기해변"
        },
        "note": {
          "ko": "성산일출봉을 바라보며 마친다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 20,
        "lat": 33.45245,
        "lng": 126.92458,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/d5b7e9a3-8cfb-41cf-9623-9b15651d4c55.webp"
      }
    ]
  },
  {
    "id": "olle-2",
    "filters": [
      "olle"
    ],
    "name": {
      "ko": "쇠소깍에서 서귀포까지 6코스"
    },
    "summary": {
      "ko": "쇠소깍 / 제지기오름, 보목 방향 / 보목포구"
    },
    "description": {
      "ko": "쇠소깍에서 보목 바다를 거쳐 서귀포 원도심으로 들어간다. 도착 뒤 이중섭거리나 올레시장을 이어서 둘러보기 좋다."
    },
    "trail": {
      "km": "10.1km",
      "hours": "3~4",
      "level": "low"
    },
    "tip": {
      "ko": "별 한 개라도 10km가 넘는다. 아래 구간별 활동 시간은 약 4시간이며, 사진, 휴식을 포함해 4~5시간을 확보한다. 서귀포 시내 숙소라면 종점에서 동선을 잇기 편하다. 휠체어 접근 구간은 전체 코스와 별도로 안내되므로 해당 구간을 확인한다."
    },
    "stops": [
      {
        "name": {
          "ko": "쇠소깍"
        },
        "note": {
          "ko": "하천과 바다가 맞닿는 곳에서 출발한다."
        },
        "stay": 30,
        "lat": 33.25409,
        "lng": 126.6223,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/16/54503744-a4b3-4e68-b819-47e67df59100.webp"
      },
      {
        "name": {
          "ko": "제지기오름, 보목 방향"
        },
        "note": {
          "ko": "오름과 남쪽 바다를 잇는 길을 걷는다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 60,
        "lat": 33.24223,
        "lng": 126.60938,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202112/03/a6c1a296-bf3b-4fd9-8c21-87a7c94df8f1.webp"
      },
      {
        "name": {
          "ko": "보목포구"
        },
        "note": {
          "ko": "섶섬이 보이는 해안 마을 구간."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 50,
        "lat": 33.23927,
        "lng": 126.60689,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201907/17/3dfdaafa-6623-4a49-915e-a7e4f7c659fe.webp"
      },
      {
        "name": {
          "ko": "자구리공원 주변"
        },
        "note": {
          "ko": "바다를 보며 서귀포 도심 쪽으로 향한다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 60,
        "lat": 33.2443,
        "lng": 126.56905,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/23/e3f609dd-45af-45c0-be0c-4b49739854c4.webp"
      },
      {
        "name": {
          "ko": "제주올레여행자센터"
        },
        "note": {
          "ko": "원도심에서 걷기를 마친다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 40,
        "lat": 33.24741,
        "lng": 126.55873,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202401/17/f1be063a-474d-4d71-b640-958795e09909.webp"
      }
    ]
  },
  {
    "id": "olle-3",
    "filters": [
      "olle"
    ],
    "name": {
      "ko": "외돌개를 지나는 7코스"
    },
    "summary": {
      "ko": "제주올레여행자센터 / 외돌개 해안 / 돔베낭길 부근"
    },
    "description": {
      "ko": "서귀포 원도심에서 외돌개와 법환포구를 지나간다. 외돌개 절벽 해안과 섬들이 보이는 남쪽 바다가 이 코스의 중심 풍경이다."
    },
    "trail": {
      "km": "12.9km",
      "hours": "3~4",
      "level": "mid"
    },
    "tip": {
      "ko": "수봉로와 해안을 지나며 걷는다. 아래 구간별 활동 시간은 약 4시간이며, 사진, 휴식을 포함해 4~5시간을 확보한다. 법환포구 일대는 경로 변경 이력이 있으므로 현장의 올레 표지와 최신 코스 지도를 따른다."
    },
    "stops": [
      {
        "name": {
          "ko": "제주올레여행자센터"
        },
        "note": {
          "ko": "서귀포 시내에서 출발한다."
        },
        "stay": 40,
        "lat": 33.24741,
        "lng": 126.55873,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202401/17/f1be063a-474d-4d71-b640-958795e09909.webp"
      },
      {
        "name": {
          "ko": "외돌개 해안"
        },
        "note": {
          "ko": "절벽과 바다 풍경을 바라보며 걷는다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 60,
        "lat": 33.24006,
        "lng": 126.54573,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/26/364e4579-cc5f-4e38-a520-36cde0e0ef17.webp"
      },
      {
        "name": {
          "ko": "돔베낭길 부근"
        },
        "note": {
          "ko": "돌담과 바다를 따라 이어지는 걷기 구간."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 50,
        "lat": 33.23998,
        "lng": 126.53188,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/ba52007b-1f22-497d-955e-85bb891d937e.webp"
      },
      {
        "name": {
          "ko": "법환포구 부근"
        },
        "note": {
          "ko": "포구를 지나 서쪽으로 향한다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 50,
        "lat": 33.23777,
        "lng": 126.51579,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/15/10f67d40-11e4-42a0-b8ef-4a5bcc384a0b.webp"
      },
      {
        "name": {
          "ko": "서귀포버스터미널"
        },
        "note": {
          "ko": "공식 코스 끝에서 마친다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 40,
        "lat": 33.24682,
        "lng": 126.5082,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/01/3549901_image3_1.jpg"
      }
    ]
  },
  {
    "id": "olle-4",
    "filters": [
      "olle"
    ],
    "name": {
      "ko": "하도에서 종달까지 21코스"
    },
    "summary": {
      "ko": "하도 출발점 / 하도 해안 구간 / 지미봉 주변"
    },
    "description": {
      "ko": "동쪽 해안과 지미봉을 지나 종달로 향한다. 지미봉에서는 우도와 성산일출봉이 함께 보인다."
    },
    "trail": {
      "km": "11.3km",
      "hours": "3~4",
      "level": "low"
    },
    "tip": {
      "ko": "지미봉 오름길의 계단이 주요 오르막이다. 오르막을 피하는 우회로를 선택할 수 있지만 전망은 달라진다. 아래 활동 시간은 약 4시간이며 휴식을 포함해 4시간 30분 안팎을 잡는다. 종점에서 출발점으로 돌아갈 계획이라면 버스 정류장까지 추가로 걸어야 할 수 있으므로 귀가 동선을 확인한다."
    },
    "stops": [
      {
        "name": {
          "ko": "하도 출발점"
        },
        "note": {
          "ko": "동쪽 해안마을에서 걸음을 시작한다."
        },
        "stay": 35,
        "lat": 33.52443,
        "lng": 126.86271,
        "photo": "/course-photos/olle21-hado-start.jpg"
      },
      {
        "name": {
          "ko": "하도 해안 구간"
        },
        "note": {
          "ko": "바다 곁의 느린 길을 따라간다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 55,
        "lat": 33.5183,
        "lng": 126.9017,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202407/23/1b0be13e-4828-4c77-a104-0116943f3cb3.webp"
      },
      {
        "name": {
          "ko": "지미봉 주변"
        },
        "note": {
          "ko": "계단을 올라 우도와 성산일출봉을 바라본다. 필요하면 안내된 우회로를 따른다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 70,
        "lat": 33.48953,
        "lng": 126.87794,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/186b6f0a-edf8-4601-97b3-9836114dca5c.webp"
      },
      {
        "name": {
          "ko": "종달리 마을길"
        },
        "note": {
          "ko": "돌담과 밭을 지나는 길."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 55,
        "lat": 33.49788,
        "lng": 126.89809,
        "photo": "/course-photos/olle21-jongdal-village.jpg"
      },
      {
        "name": {
          "ko": "종달리 코스 끝"
        },
        "note": {
          "ko": "동쪽 바다를 보며 마무리한다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 25,
        "lat": 33.51125,
        "lng": 126.89887,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/616136b5-3560-42f5-bd9f-4cd449cdf6cd.webp"
      }
    ]
  },
  {
    "id": "day-5",
    "filters": [
      "day"
    ],
    "name": {
      "ko": "공항으로 돌아가는 길, 제주시 바다와 원도심"
    },
    "summary": {
      "ko": "이호테우해수욕장 / 도두봉 / 용두암"
    },
    "description": {
      "ko": "서쪽 해변에서 출발해 공항 북쪽 바다와 제주시 골목을 지나 공항 쪽으로 돌아오는 10:00~18:00 약 8시간 일정."
    },
    "minutes": 480,
    "stops": [
      {
        "name": {
          "ko": "이호테우해수욕장"
        },
        "note": {
          "ko": "말 모양 등대와 낮은 파도를 보며 하루를 시작한다."
        },
        "time": "10:00~10:50",
        "stay": 50,
        "lat": 33.49619,
        "lng": 126.45595,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201808/08/fa5051e7-6840-4257-b2ab-50a035045352.webp"
      },
      {
        "name": {
          "ko": "도두봉"
        },
        "note": {
          "ko": "바다와 공항 쪽 풍경을 내려다본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "11:00~11:50",
        "stay": 50,
        "lat": 33.50714,
        "lng": 126.46848,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/16/63992138-b676-48cb-bde4-60c7279af0a0.webp"
      },
      {
        "name": {
          "ko": "용두암"
        },
        "note": {
          "ko": "검은 바위와 북쪽 바다를 가까이서 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "12:00~13:00",
        "stay": 60,
        "lat": 33.51496,
        "lng": 126.51169,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/39fa654e-5805-4d29-9dfc-e8950f29292a.webp"
      },
      {
        "name": {
          "ko": "우진해장국"
        },
        "note": {
          "ko": "제주 향토 음식인 고사리육개장으로 점심을 먹는다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "13:10~14:10",
        "stay": 60,
        "lat": 33.51149,
        "lng": 126.52009,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/22/a2f878cb-65ac-4ed8-ae18-c8850c45471a.webp"
      },
      {
        "name": {
          "ko": "제주목관아"
        },
        "note": {
          "ko": "제주시 원도심의 오래된 공간을 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "14:20~15:10",
        "stay": 50,
        "lat": 33.5141,
        "lng": 126.52193,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/17/500ec013-b883-4baf-ae6e-cd9e55d2a0be.webp"
      },
      {
        "name": {
          "ko": "커피파인더"
        },
        "note": {
          "ko": "시청 근처 골목의 카페에서 쉬어 간다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "15:20~16:10",
        "stay": 50,
        "lat": 33.49858,
        "lng": 126.52876,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/cb0765e2-e881-4172-89b7-d1d0b3d19059.webp"
      },
      {
        "name": {
          "ko": "동문시장"
        },
        "note": {
          "ko": "시장 골목을 둘러보며 간단한 먹거리를 구경한다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "time": "16:20~17:05",
        "stay": 45,
        "lat": 33.5116,
        "lng": 126.52602,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202603/16/e7f789c8-82eb-4131-bb49-c51d6f3f943b.webp"
      },
      {
        "name": {
          "ko": "산지물 제주공항본점"
        },
        "note": {
          "ko": "회나 물회, 생선조림으로 저녁을 먹고 마친다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "time": "17:10~18:00",
        "stay": 50,
        "lat": 33.51626,
        "lng": 126.52756,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/15/d07183e6-13b5-4fa7-b19b-67c682ca31e1.webp"
      }
    ]
  },
  {
    "id": "meal-5",
    "filters": [
      "meal"
    ],
    "name": {
      "ko": "협재 바다와 한림의 디저트"
    },
    "summary": {
      "ko": "명랑스낵 / 이익새양과점 / 협재해수욕장"
    },
    "description": {
      "ko": "바다를 보며 점심을 먹고, 한림에서 디저트를 포장해 협재해변에서 먹는 짧은 코스."
    },
    "stops": [
      {
        "name": {
          "ko": "명랑스낵"
        },
        "note": {
          "ko": "떡볶이와 튀김을 먹으며 옥상에서는 비양도 방향의 바다를 볼 수 있다."
        },
        "stay": 60,
        "lat": 33.40928,
        "lng": 126.25884,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202203/11/daa7e2fc-971e-43b8-865a-1fe943d1aad4.webp"
      },
      {
        "name": {
          "ko": "이익새양과점 (디저트 포장)"
        },
        "note": {
          "ko": "밀크티와 파운드케이크를 포장한다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 10,
        "lat": 33.40706,
        "lng": 126.26557,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201903/25/37f2db4e-ea74-4c84-8146-f63471ae242d.webp"
      },
      {
        "name": {
          "ko": "협재해수욕장 (디저트 먹기)"
        },
        "note": {
          "ko": "맑은 물빛과 비양도가 보이는 해변에서 포장한 디저트를 먹고 걷는다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 60,
        "lat": 33.39248,
        "lng": 126.23899,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202408/27/6b6dc9c4-5466-493e-98e5-580dbf18eefc.webp"
      }
    ]
  },
  {
    "id": "drive-5",
    "filters": [
      "drive"
    ],
    "name": {
      "ko": "표선에서 남원으로 남쪽 해안"
    },
    "summary": {
      "ko": "표선해수욕장 / 토산포구 주변 / 남원 큰엉 해안"
    },
    "description": {
      "ko": "표선에서 서쪽으로 이동하며 남원 큰엉과 위미항, 공천포를 잇는 약 4시간 35분 코스. 차창에서 바다를 보고 각 지점에서 짧게 내린다."
    },
    "minutes": 275,
    "stops": [
      {
        "name": {
          "ko": "표선해수욕장"
        },
        "note": {
          "ko": "넓은 모래사장과 바다에서 출발한다."
        },
        "stay": 30,
        "lat": 33.32723,
        "lng": 126.8381,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202110/29/75201e85-e5f0-498a-986a-043dac98d1fb.webp"
      },
      {
        "name": {
          "ko": "토산포구 주변"
        },
        "note": {
          "ko": "작은 포구와 바닷마을의 분위기를 느낀다."
        },
        "move": {
          "mode": "car",
          "minutes": 25
        },
        "stay": 20,
        "photo": "/course-photos/drive-tosan-port.jpg",
        "lat": 33.30385,
        "lng": 126.78916
      },
      {
        "name": {
          "ko": "남원 큰엉 해안"
        },
        "note": {
          "ko": "절벽을 따라 이어지는 남쪽 바다를 감상한다."
        },
        "move": {
          "mode": "car",
          "minutes": 15
        },
        "stay": 50,
        "lat": 33.27338,
        "lng": 126.70375,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/d6c66fd7-a08b-45c8-bf7f-1ac90c994599.webp"
      },
      {
        "name": {
          "ko": "위미항"
        },
        "note": {
          "ko": "항구와 마을을 천천히 둘러본다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 35,
        "lat": 33.27128,
        "lng": 126.66238,
        "photo": "https://tong.visitkorea.or.kr/cms/resource/57/3390157_image3_1.jpg"
      },
      {
        "name": {
          "ko": "공천포 바다"
        },
        "note": {
          "ko": "돌담과 해안이 이어지는 곳에서 쉬어 간다."
        },
        "move": {
          "mode": "car",
          "minutes": 10
        },
        "stay": 30,
        "lat": 33.26769,
        "lng": 126.646,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/19/598a9a25-3662-4b21-a96e-43642396652b.webp"
      },
      {
        "name": {
          "ko": "모노클제주"
        },
        "note": {
          "ko": "남원 가까운 카페에서 음료를 마시며 마무리한다."
        },
        "move": {
          "mode": "car",
          "minutes": 5
        },
        "stay": 45,
        "lat": 33.27091,
        "lng": 126.65848,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202611/17/c717bf46-4fe3-4674-ab18-cb15d5add837.webp"
      }
    ]
  },
  {
    "id": "olle-5",
    "filters": [
      "olle"
    ],
    "name": {
      "ko": "대평에서 화순까지 9코스"
    },
    "summary": {
      "ko": "대평포구 / 군산오름 방향 숲길 / 안덕계곡 구간"
    },
    "description": {
      "ko": "바다를 떠나 군산오름과 안덕계곡을 지나 화순으로 내려온다. 짧은 편이지만 오르내림이 이어져 체력 부담이 있는 코스다."
    },
    "trail": {
      "km": "12.3km",
      "hours": "3~4",
      "level": "high"
    },
    "tip": {
      "ko": "아래 구간별 활동 시간은 약 4시간이고 사진과 휴식을 더하면 4~5시간을 확보하는 편이 좋다. 오름과 계곡길에서는 현장 올레 표지를 따라가고, 출발점으로 돌아갈 교통편을 미리 확인한다."
    },
    "stops": [
      {
        "name": {
          "ko": "대평포구"
        },
        "note": {
          "ko": "바다를 등지고 걷기 시작하는 코스 출발점."
        },
        "stay": 30,
        "lat": 33.2371,
        "lng": 126.36139,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/201804/30/4b2a8f02-7a35-4f66-be24-56ea60c4c8f1.webp"
      },
      {
        "name": {
          "ko": "군산오름 방향 숲길"
        },
        "note": {
          "ko": "오르막을 지나 높아진 시야로 바다를 돌아본다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 80,
        "lat": 33.25162,
        "lng": 126.36819,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202111/04/30844d88-66cc-4749-a0ba-34a8afd58c63.webp"
      },
      {
        "name": {
          "ko": "안덕계곡 구간"
        },
        "note": {
          "ko": "숲과 계곡이 이어지는 길을 걷는다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 80,
        "lat": 33.25844,
        "lng": 126.35298,
        "photo": "https://api.cdn.visitjeju.net/photomng/thumbnailpath/202410/17/bee4b88c-cdf6-41e1-b9fa-390036de6843.webp"
      },
      {
        "name": {
          "ko": "화순 방향 마을길"
        },
        "note": {
          "ko": "중산간에서 해안 쪽으로 내려온다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 35,
        "lat": 33.25166,
        "lng": 126.3438,
        "photo": "/course-photos/olle9-hwasun-road.jpg"
      },
      {
        "name": {
          "ko": "화순 코스 끝"
        },
        "note": {
          "ko": "화순 마을 쪽에서 걷기를 마친다."
        },
        "move": {
          "mode": "walk"
        },
        "stay": 15,
        "lat": 33.23942,
        "lng": 126.33606,
        "photo": "/course-photos/olle9-hwasun-end.jpg"
      }
    ]
  }
];

// 위쪽 버튼 4개(2x2). 화면 이름은 src/i18n/ 의 course.filters
export const courseFilters = ['day', 'meal', 'drive', 'olle'];
export const DEFAULT_FILTER = 'day';
