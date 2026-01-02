const OSS = require('ali-oss');
require('dotenv').config({ path: '.env.local' });

console.log('=== Aliyun OSS 配置检查 ===\n');

// 显示当前配置
console.log('当前配置:');
console.log('- Region:', process.env.OSS_REGION || '(未设置)');
console.log('- Bucket:', process.env.OSS_BUCKET || '(未设置)');
console.log('- AccessKey ID:', process.env.OSS_ACCESS_KEY_ID ? process.env.OSS_ACCESS_KEY_ID.substring(0, 10) + '...' : '(未设置)');
console.log('');

// 初始化客户端
const client = new OSS({
  region: process.env.OSS_REGION || '',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || '',
});

async function checkOSS() {
  try {
    console.log('正在测试连接...\n');

    // 尝试获取bucket信息
    const result = await client.getBucketInfo();
    console.log('✓ 连接成功!\n');
    console.log('Bucket信息:');
    console.log('- Name:', result.bucket);
    console.log('- Region:', result.location);
    console.log('- Creation Date:', result.creationDate);
    console.log('- Storage Class:', result.storageClass);

    // 检查region是否匹配
    const configuredRegion = process.env.OSS_REGION;
    const actualRegion = result.location;

    console.log('\nRegion检查:');
    console.log(`- 配置的Region: ${configuredRegion}`);
    console.log(`- 实际的Region: ${actualRegion}`);

    if (configuredRegion !== actualRegion) {
      console.log('\n⚠️  Region不匹配! 请修改 .env.local 中的 OSS_REGION 为:', actualRegion);
    } else {
      console.log('\n✓ Region配置正确');
    }

    // 尝试列出文件
    console.log('\n正在尝试列出bucket中的文件...');
    try {
      const listResult = await client.list();
      console.log(`✓ 成功! Bucket中有 ${listResult.objects ? listResult.objects.length : 0} 个文件`);
      if (listResult.objects && listResult.objects.length > 0) {
        console.log('前5个文件:');
        listResult.objects.slice(0, 5).forEach(obj => {
          console.log(`  - ${obj.name} (${(obj.size / 1024).toFixed(2)} KB)`);
        });
      }
    } catch (listError) {
      console.log('✗ 无法列出文件 (权限不足或bucket为空)');
    }

  } catch (error) {
    console.log('✗ 连接失败!\n');
    console.log('错误信息:', error.message);
    console.log('\n可能的原因:');
    console.log('1. Bucket名称错误');
    console.log('2. Region配置错误 (最常见)');
    console.log('3. AccessKey ID或Secret错误');
    console.log('4. AccessKey没有该Bucket的权限');
    console.log('5. Bucket不存在');

    console.log('\n建议的解决步骤:');
    console.log('1. 登录阿里云OSS控制台: https://oss.console.aliyun.com/');
    console.log('2. 找到你的Bucket "lemon-blog-oss"');
    console.log('3. 查看Bucket的概览页面，确认实际的Region');
    console.log('4. 修改 .env.local 中的 OSS_REGION 为正确的值');
    console.log('5. 常见Region值:');
    console.log('   - oss-cn-hangzhou (华东1-杭州)');
    console.log('   - oss-cn-shanghai (华东2-上海)');
    console.log('   - oss-cn-beijing (华北2-北京)');
    console.log('   - oss-cn-shenzhen (华南1-深圳)');
    console.log('   - oss-cn-guangzhou (华南2-广州)');
    console.log('   - oss-cn-chengdu (西南1-成都)');
  }
}

checkOSS().catch(console.error);
