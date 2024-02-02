import pandas as pd
import json

def type_generate(id):
    dict_type = {0:'rider', 1:'taxi', 2:'bus', 3:'other'}
    return dict_type[id%4]
file_name = 'crusing'
# 读取csv文件
data = pd.read_csv(f"./{file_name}.csv")
unique_ids = data['route_name_list'].unique()

print(data.columns)
# 将数据按routeID进行分组，每个ID对应一个经纬度列表
# data = data.sort_values(by='route_id')
print(data.loc[data['type_list']=='point','status_list'].unique())
grouped = data.groupby('route_name_list')[['lat', 'lon','type_list','status_list','direction_angle_list', 'matched_rider_cnt',
       'OrgPickup_cnt', 'reposition_recommend_cnt',
       'reposition_recommend_and_accept_cnt',
       'reposition_recommend_but_reject_cnt', 'matching_rate',
       'unmatched_rider_cnt', 'total_revenue',
       'total_revenue_added_by_reposition']].apply(lambda x: x.values.tolist())

# 将grouped对象转换为字典
data_dict = grouped.to_dict()

# 将字典以json格式保存
with open(f'{file_name}.json', 'w') as f:
    json.dump(data_dict, f)