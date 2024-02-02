import pandas as pd
import folium
import matplotlib.colors as mcolors
from folium.plugins import TimestampedGeoJson
from datetime import datetime
import numpy as np
import json
import re


def time_transfer(time):
    # 定义日期格式
    date_format = "%Y-%m-%d %H:%M:%S"
    return datetime.strptime(time, date_format)

# def interploration(data,num):
def type_generate(id):
    dict_type = {0:'rider', 1:'taxi', 2:'bus', 3:'other'}
    return dict_type[id%4]

def data_process_bus_staiton():
    data = pd.read_csv("./bus_station_Manhattan.csv")
    station_data = data[['OBJECTID', 'LONGITUDE', 'LATITUDE']]
    grouped = data.groupby('OBJECTID')[['LATITUDE', 'LONGITUDE']].apply(lambda x: x.values.tolist())

    # 将grouped对象转换为字典
    data_dict = grouped.to_dict()

    # 将字典以json格式保存
    with open('bus_station_Manhattan.json', 'w') as f:
        json.dump(data_dict, f)
    # 写入到json文件中

def split_loc(str_data):
    match = re.match(r"POINT \((.*?) (.*?)\)", str_data)
    if match:
        longitude = float(match.group(1))
        latitude = float(match.group(2))
        return pd.Series([latitude, longitude])

if __name__ == "__main__":
    data = pd.read_csv("./subway_station.csv")
    subway_station_data = data[['the_geom']].apply(lambda row: split_loc(row['the_geom']), axis=1)
    subway_station_data.columns = ['lat', 'lng']
    subway_station_data['stationID'] = data['OBJECTID']
    subway_station_data = subway_station_data[['stationID','lat','lng']]
    print(subway_station_data['lat'].max(),subway_station_data['lat'].min())
    print(subway_station_data['lng'].max(),subway_station_data['lng'].min())
    subway_station_data = subway_station_data.loc[(subway_station_data['lng']<-73.9214)&(subway_station_data['lat']>40.6968)&(subway_station_data['lat']<40.8845)&(subway_station_data['lng']>-74.0831)]
    print(subway_station_data['lng'].max(),subway_station_data['lng'].min())

    subway_station_data = subway_station_data.reset_index()
    grouped = subway_station_data.groupby('stationID')[['lat', 'lng']].apply(lambda x: x.values.tolist())
    print(subway_station_data)
    # 将grouped对象转换为字典
    data_dict = grouped.to_dict()

    # 将字典以json格式保存
    with open('subway_station_Manhattan.json', 'w') as f:
        json.dump(data_dict, f)
