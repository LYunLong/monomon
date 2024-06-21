from funasr import AutoModel
# paraformer-zh is a multi-functional asr model
# use vad, punc, spk or not as you need
model = AutoModel(model="paraformer-zh",  vad_model="fsmn-vad", punc_model="ct-punc", 
                  # spk_model="cam++"
                  )
# res = model.generate(input=f"{model.model_path}/example/asr_example.wav", 
res = model.generate(input=f"/Users/liyunlong/Projects/monomon/examples/static-html/Ai/ai捕获的周总和雷总的电话录音.mp3", 
            batch_size_s=300, 
            hotword='魔搭')
print(res)

